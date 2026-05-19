import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { VipService } from './vip.service';

const getVipContent = catchAsync(async (req: Request, res: Response) => {
  const result = await VipService.getVipContentFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'VIP content retrieved successfully',
    data: result,
  });
});

export const VipController = {
  getVipContent,
};
