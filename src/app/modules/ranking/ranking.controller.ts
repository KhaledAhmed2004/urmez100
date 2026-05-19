import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { RankingService } from './ranking.service';

const getVipRankings = catchAsync(async (req: Request, res: Response) => {
  const result = await RankingService.getVipRankingsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'VIP rankings retrieved successfully',
    data: result,
  });
});

export const RankingController = {
  getVipRankings,
};
