
import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { DashboardServices } from './services';

const stats: RequestHandler = catchAsync(async (req, res) => {
  const result = await DashboardServices.stats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dashboard Information retvied succesfully',
    data: result,
  });
});

export const DashboardControllers = {
  stats
};
