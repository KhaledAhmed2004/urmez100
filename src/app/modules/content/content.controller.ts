import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ContentService } from './content.service';

const searchContent = catchAsync(async (req: Request, res: Response) => {
  const result = await ContentService.searchContentFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Content searched successfully',
    pagination: result.pagination,
    data: result.data,
  });
});

const favoriteContent = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const { contentId } = req.params;
  const result = await ContentService.favoriteContentInDB(user.id, contentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Content favorited successfully',
    data: result,
  });
});

const unfavoriteContent = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const { contentId } = req.params;
  const result = await ContentService.unfavoriteContentFromDB(user.id, contentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Content unfavorited successfully',
    data: result,
  });
});

const getBestMovies = catchAsync(async (req: Request, res: Response) => {
  const result = await ContentService.getBestMoviesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Best movies retrieved successfully',
    data: result,
  });
});

const getComingSoonContent = catchAsync(async (req: Request, res: Response) => {
  const result = await ContentService.getComingSoonContentFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coming soon content retrieved successfully',
    data: result,
  });
});

export const ContentController = {
  searchContent,
  favoriteContent,
  unfavoriteContent,
  getBestMovies,
  getComingSoonContent,
};
