import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { AttendanceServices } from './services';
import { JwtPayload } from 'jsonwebtoken';

const stats: RequestHandler = catchAsync(async (req, res) => {
  // Filtering option for month, year
  const result = await AttendanceServices.stats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance status retvied succesfully',
    data: result,
  });
});

const employeeSheet: RequestHandler = catchAsync(async (req, res) => {
  // Filtering option for month, year
  const result = await AttendanceServices.employeeSheet();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Attendance sheet retvied succesfully',
    data: result,
  });
});

const mySheet: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload
  const result = await AttendanceServices.mySheet(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your attendance sheet retvied succesfully',
    data: result,
  });
});

const attdStatus: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload
  const result = await AttendanceServices.attdStatus(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Your Attendance status retvied succesfully',
    data: result,
  });
});

const confirmAttendance: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload
  const result = await AttendanceServices.confirmAttendance(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Confirmed your attendance succesfully',
    data: result,
  });
});

export const AttendanceControllers = {
  stats, employeeSheet, mySheet, attdStatus, confirmAttendance
};
