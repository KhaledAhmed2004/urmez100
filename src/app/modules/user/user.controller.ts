import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import { USER_STATUS } from '../../../enums/user';
import { JwtPayload } from 'jsonwebtoken';
import { ExportBuilder } from '../../builder';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { ...userData } = req.body;
  const result = await UserService.createUserToDB(userData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'User created successfully',
    data: result,
  });
});

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user as JwtPayload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  // All files + text data are in req.body
  const payload = { ...req.body };

  const result = await UserService.updateProfileToDB(
    user as JwtPayload,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile updated successfully',
    data: result,
  });
});

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status } = req.body as { status: USER_STATUS };

  const result = await UserService.updateUserStatusInDB(userId, status);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User status updated',
    data: result,
  });
});

const adminUpdateUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const payload = { ...req.body };
  const result = await UserService.updateUserByAdminInDB(userId, payload);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User updated',
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  await UserService.deleteUserPermanentlyFromDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User deleted',
  });
});

const bulkDeleteUsers = catchAsync(async (req: Request, res: Response) => {
  const { userIds } = req.body as { userIds: string[] };
  const result = await UserService.bulkDeleteUsersFromDB(userIds);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `${result.deletedCount} users deleted successfully`,
  });
});

const getAllUserRoles = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUserRolesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User list fetched',
    pagination: result.pagination,
    data: result.data,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await UserService.getUserByIdFromDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User data retrieved',
    data: result,
  });
});

const getUserDetailsById = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await UserService.getUserDetailsByIdFromDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User details retrieved successfully',
    data: result,
  });
});

const getUsersStats = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUsersStatsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'User stats retrieved successfully',
    data: result,
  });
});

const exportUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.exportUsersFromDB(req.query);

  await new ExportBuilder(result)
    .format('csv')
    .columns([
      'name',
      'email',
      'status',
      'role',
      'coins',
      'subscriptionStatus',
      'subscriptionPlan',
      'createdAt',
    ])
    .headers({
      name: 'User Name',
      email: 'Email',
      status: 'Status',
      role: 'Role',
      coins: 'Coins',
      subscriptionStatus: 'Subscription Status',
      subscriptionPlan: 'Plan',
      createdAt: 'Joined At',
    })
    .sendResponse(res, `users-export-${Date.now()}`);
});

const getRecentlyWatched = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await UserService.getRecentlyWatchedFromDB((user as any).id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Recently watched content retrieved successfully',
    data: result,
  });
});

const syncWatchProgress = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const { contentId } = req.params;
  const payload = req.body;

  const result = await UserService.recordRecentlyWatchedInDB(
    (user as any).id,
    contentId,
    payload,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Watch progress synced successfully',
    data: result,
  });
});

const getMyCollection = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const result = await UserService.getMyCollectionFromDB((user as any).id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'My collection retrieved successfully',
    data: result,
  });
});

export const UserController = {
  createUser,
  getUserProfile,
  updateProfile,
  getAllUserRoles,
  updateUserStatus,
  adminUpdateUser,
  deleteUser,
  bulkDeleteUsers,
  getUserById,
  getUserDetailsById,
  getUsersStats,
  exportUsers,
  getRecentlyWatched,
  syncWatchProgress,
  getMyCollection,
};
