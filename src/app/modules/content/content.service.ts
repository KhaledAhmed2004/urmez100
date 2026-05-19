import httpStatus from 'http-status';
import { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import ApiError from '../../../errors/ApiError';
import { Content } from './content.model';
import { FavoriteContent } from '../favorite-content/favorite-content.model';

const searchContentFromDB = async (query: Record<string, unknown>) => {
  const searchableFields = ['title', 'description'];

  // Handle specific "filter" parameter from documentation
  if (query.filter === 'popular') {
    query.sort = '-views';
  } else if (query.filter === 'new') {
    query.sort = '-createdAt';
  }

  const cardFields = 'title poster type rating isPremium isRecent';

  const contentQuery = new QueryBuilder(Content.find().select(cardFields), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await contentQuery.modelQuery;
  const pagination = await contentQuery.getPaginationInfo();

  return {
    pagination,
    data: result,
  };
};

const favoriteContentInDB = async (userId: string, contentId: string) => {
  const isContentExist = await Content.findById(contentId);
  if (!isContentExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Content not found');
  }

  const result = await FavoriteContent.findOneAndUpdate(
    {
      userId: new Types.ObjectId(userId),
      contentId: new Types.ObjectId(contentId),
    },
    {
      userId: new Types.ObjectId(userId),
      contentId: new Types.ObjectId(contentId),
    },
    { upsert: true, new: true },
  );
  return result;
};

const unfavoriteContentFromDB = async (userId: string, contentId: string) => {
  const result = await FavoriteContent.findOneAndDelete({
    userId: new Types.ObjectId(userId),
    contentId: new Types.ObjectId(contentId),
  });
  return result;
};

const getBestMoviesFromDB = async () => {
  const result = await Content.find({ type: 'MOVIE' }).sort({ rating: -1 }).limit(10);
  return result;
};

const getComingSoonContentFromDB = async () => {
  const result = await Content.find({ isRecent: true }).sort({ createdAt: -1 }).limit(10);
  return result;
};

export const ContentService = {
  searchContentFromDB,
  favoriteContentInDB,
  unfavoriteContentFromDB,
  getBestMoviesFromDB,
  getComingSoonContentFromDB,
};
