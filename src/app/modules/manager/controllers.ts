/* eslint-disable @typescript-eslint/ban-ts-comment */
import catchAsync from '@/shared/catchAsync';
import { RequestHandler } from 'express';
import sendResponse from '@/shared/sendResponse';
import httpStatus from 'http-status';
import { ManagerServices } from './services';
import { JwtPayload } from 'jsonwebtoken';


const get: RequestHandler = catchAsync(async (req, res) => {
  const result = await ManagerServices.get();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Manager Information retvied succesfully',
    data: result,
  });
});

const getDetails: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id
  const result = await ManagerServices.getDetails(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Manager Information retvied succesfully',
    data: result,
  });
});

const getSelectOptions: RequestHandler = catchAsync(async (req, res) => {
  const result = await ManagerServices.getSelectOptions();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Manager Information retvied succesfully',
    data: result,
  });
});

const getMyManager: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload
  const result = await ManagerServices.getMyManager(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Manager Information retvied succesfully',
    data: result,
  });
});



export const ManagerControllers = {
  get,getDetails, getSelectOptions,getMyManager
};
