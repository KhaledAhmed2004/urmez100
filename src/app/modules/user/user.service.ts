import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_STATUS, USER_ROLES } from '../../../enums/user';
import { PipelineStage, Types } from 'mongoose';
import { Subscription as SubscriptionModel } from '../subscription/subscription.model';
import { SUBSCRIPTION_STATUS } from '../subscription/subscription.interface';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import { sendVerificationOTP } from '../../../helpers/authHelpers';
import { deleteFile } from '../../middlewares/fileHandler';
import generateOTP from '../../../util/generateOTP';
import { User } from './user.model';
import { RecentlyWatched } from '../recently-watched/recently-watched.model';
import { FavoriteContent } from '../favorite-content/favorite-content.model';
import { Content } from '../content/content.model';
import QueryBuilder from '../../builder/QueryBuilder';
import AggregationBuilder from '../../builder/AggregationBuilder';
import { IUser } from './user.interface';

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  // Users start unverified. The verify-OTP flow flips `verified: true`
  // once the user enters the code emailed below. Do NOT pass
  // `verified: true` here — it bypasses email verification and defeats
  // the auth flow.
  const createUser = await User.create({ ...payload });
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  // Fire and forget OTP email. Signup must still succeed even if the
  // email transport has a transient failure — the user can request a
  // resend via /auth/resend-verify-email.
  try {
    await sendVerificationOTP(createUser.email);
  } catch (err) {
    console.error('Signup OTP send failed:', err);
  }

  return createUser;
};

const getUserProfileFromDB = async (
  user: JwtPayload,
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>,
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  // Delete old profile picture if a new one is being uploaded
  if (payload.profilePicture && isExistUser.profilePicture) {
    await deleteFile(isExistUser.profilePicture);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(['name', 'email'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const users = await userQuery.modelQuery;
  const paginationInfo = await userQuery.getPaginationInfo();

  return {
    pagination: paginationInfo,
    data: users,
  };
};

const getUsersStatsFromDB = async () => {
  const aggregationBuilder = new AggregationBuilder(User as any);
  
  // Overall user growth
  const totalStats = await aggregationBuilder.calculateGrowth({ period: 'month' });
  
  // activeUsersNewThisMonth: Users with ACTIVE status created this month vs last month
  aggregationBuilder.reset();
  const activeStats = await aggregationBuilder.calculateGrowth({ 
    filter: { status: USER_STATUS.ACTIVE }, 
    period: 'month' 
  });
  
  // totalSubscribedNewThisMonth: Subscriptions created this month vs last month
  const subBuilder = new AggregationBuilder(SubscriptionModel as any);
  const subscriptionStats = await subBuilder.calculateGrowth({
    filter: { status: SUBSCRIPTION_STATUS.ACTIVE },
    period: 'month'
  });

  const formatMetric = (stat: any) => ({
    value: stat.total,
    changePct: Math.abs(stat.growth),
    direction: stat.growthType === 'increase' ? 'up' : stat.growthType === 'decrease' ? 'down' : 'neutral',
  });

  return {
    meta: {
      comparisonPeriod: 'month',
    },
    totalUsers: formatMetric(totalStats),
    activeUsersNewThisMonth: formatMetric(activeStats),
    totalSubscribedNewThisMonth: formatMetric(subscriptionStats),
  };
};

const getAllUserRolesFromDB = async (query: Record<string, unknown>) => {
  const {
    search,
    email,
    role, // role optional rakhbo jate query na pathale shob role ashe, kintu default thakbe na
    status,
    specialty,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const match: Record<string, any> = {};
  if (status) match.status = status;
  
  // Only return users with role 'USER'. Admin roles are excluded from this list.
  match.role = role || USER_ROLES.USER;

  if (email) match.email = { $regex: email, $options: 'i' };
  if (search) {
    match.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const basePipeline: PipelineStage[] = [
    { $match: match },
    // Lookup subscription status
    {
      $lookup: {
        from: SubscriptionModel.collection.name,
        localField: '_id',
        foreignField: 'userId',
        as: 'subscription',
      },
    },
    {
      $addFields: {
        subscriptionStatus: {
          $ifNull: [{ $arrayElemAt: ['$subscription.status', 0] }, 'inactive'],
        },
        subscriptionPlan: {
          $ifNull: [{ $arrayElemAt: ['$subscription.plan', 0] }, 'FREE'],
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phone: 1,
        specialty: 1,
        hospital: 1,
        status: 1,
        verified: 1,
        role: 1,
        profilePicture: 1,
        coins: { $ifNull: ['$points', 0] },
        subscriptionStatus: 1,
        subscriptionPlan: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ];

  const sortStage: PipelineStage = {
    $sort: { [sortBy as string]: sortOrder === 'desc' ? -1 : 1 },
  };

  const paginatedPipeline: PipelineStage[] = [
    ...basePipeline,
    sortStage,
    { $skip: skip },
    { $limit: Number(limit) },
  ];

  const countPipeline: PipelineStage[] = [
    ...basePipeline,
    { $count: 'total' },
  ];

  const [data, countResult] = await Promise.all([
    User.aggregate(paginatedPipeline),
    User.aggregate(countPipeline),
  ]);

  const total = countResult[0]?.total || 0;
  const totalPages = Math.ceil(total / Number(limit));
  return {
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages,
      hasNext: Number(page) < totalPages,
      hasPrev: Number(page) > 1,
    },
    data,
  };
};

const updateUserStatusInDB = async (id: string, status: USER_STATUS) => {
  const user = await User.isExistUserById(id);
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );

  return updatedUser;
};

const deleteUserPermanentlyFromDB = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User doesn't exist!");
  }

  // Delete profile picture from storage if it exists
  if (user.profilePicture) {
    await deleteFile(user.profilePicture);
  }

  const deletedUser = await User.findByIdAndDelete(id).select(
    '-password -authentication',
  );
  return deletedUser;
};

const bulkDeleteUsersFromDB = async (userIds: string[]) => {
  const result = await User.deleteMany({ _id: { $in: userIds } });
  return result;
};

const updateUserByAdminInDB = async (id: string, payload: Partial<IUser>) => {
  const user = await User.findById(id).select('+password');
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  // Whitelist fields admin can update (excluding password/auth info)
  if (payload.name !== undefined) (user as any).name = payload.name;
  if (payload.email !== undefined) (user as any).email = payload.email;
  if (payload.phone !== undefined) (user as any).phone = payload.phone;
  if (payload.country !== undefined) (user as any).country = payload.country;
  if (payload.specialty !== undefined) (user as any).specialty = payload.specialty;
  if (payload.hospital !== undefined) (user as any).hospital = payload.hospital;
  if (payload.location !== undefined) (user as any).location = payload.location;
  if (payload.gender !== undefined) (user as any).gender = payload.gender;
  if (payload.dateOfBirth !== undefined) (user as any).dateOfBirth = payload.dateOfBirth;
  if (payload.profilePicture !== undefined) (user as any).profilePicture = payload.profilePicture;
  if (payload.status !== undefined) (user as any).status = payload.status;
  if (payload.role !== undefined) (user as any).role = payload.role;
  if ((payload as any).coins !== undefined) (user as any).points = (payload as any).coins;
  if ((payload as any).points !== undefined) (user as any).points = (payload as any).points;

  await user.save();
  const plain = user.toObject();
  delete (plain as any).password;
  delete (plain as any).authentication;
  return plain as IUser;
};

const getUserByIdFromDB = async (id: string) => {
  // Only return user info; remove task/bid side data
  const user = await User.findById(id).select('-password -authentication');
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User doesn't exist!");
  }
  return { user };
};

const getUserDetailsByIdFromDB = async (id: string) => {
  const user = await User.findById(id).select('-password -authentication');
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User doesn't exist!");
  }
  return user;
};

const getRecentlyWatchedFromDB = async (userId: string) => {
  const cardFields = 'title thumbnail poster type rating isPremium isRecent';
  const result = await RecentlyWatched.find({ userId })
    .sort({ lastWatchedAt: -1 })
    .limit(10)
    .populate('contentId', cardFields);

  return result.map((item: any) => {
    const content = item.contentId;
    if (!content) return null;
    return {
      id: content._id,
      title: content.title,
      thumbnail: content.thumbnail,
      poster: content.poster,
      type: content.type,
      rating: content.rating,
      isPremium: content.isPremium,
      isRecent: content.isRecent,
      progress: item.completionPercentage,
      lastWatchedAt: item.lastWatchedAt,
    };
  }).filter(Boolean);
};

const recordRecentlyWatchedInDB = async (
  userId: string,
  contentId: string,
  payload: { watchedSeconds?: number },
) => {
  const content = await Content.findById(contentId);
  if (!content) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Content not found');
  }

  const watchedSeconds = payload.watchedSeconds || 0;
  const totalDurationSeconds = (content.duration || 0) * 60;
  const completionPercentage =
    totalDurationSeconds > 0
      ? Math.min(100, Number(((watchedSeconds / totalDurationSeconds) * 100).toFixed(1)))
      : 0;

  const result = await RecentlyWatched.findOneAndUpdate(
    {
      userId: new Types.ObjectId(userId),
      contentId: new Types.ObjectId(contentId),
    },
    {
      userId: new Types.ObjectId(userId),
      contentId: new Types.ObjectId(contentId),
      lastWatchedAt: new Date(),
      watchedSeconds,
      completionPercentage,
    },
    { upsert: true, new: true },
  );

  // Increment total views
  await Content.findByIdAndUpdate(contentId, { $inc: { views: 1 } });

  return result;
};

const getMyCollectionFromDB = async (userId: string) => {
  const cardFields = 'title thumbnail poster type rating isPremium isRecent';
  const result = await FavoriteContent.find({ userId })
    .sort({ createdAt: -1 })
    .populate('contentId', cardFields);

  return result.map((item: any) => {
    const content = item.contentId;
    if (!content) return null;
    return {
      id: content._id,
      title: content.title,
      thumbnail: content.thumbnail,
      poster: content.poster,
      type: content.type,
      rating: content.rating,
      isPremium: content.isPremium,
      isRecent: content.isRecent,
      addedAt: (item as any).createdAt,
    };
  }).filter(Boolean);
};

const exportUsersFromDB = async (query: Record<string, unknown>) => {
  const { data } = await getAllUserRolesFromDB({ ...query, limit: 100000 }); // Large limit for export
  return data;
};

export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  getAllUsersFromDB,
  getAllUserRolesFromDB,
  getUsersStatsFromDB,
  updateUserStatusInDB,
  getRecentlyWatchedFromDB,
  recordRecentlyWatchedInDB,
  getMyCollectionFromDB,
  updateUserByAdminInDB,
  deleteUserPermanentlyFromDB,
  bulkDeleteUsersFromDB,
  getUserByIdFromDB,
  getUserDetailsByIdFromDB,
  exportUsersFromDB,
};
