/* eslint-disable @typescript-eslint/ban-ts-comment */
import catchAsync from '@/shared/catchAsync';
import { RequestHandler } from 'express';
import sendResponse from '@/shared/sendResponse';
import httpStatus from 'http-status';
import { EmployeeServices } from './services';
import { JwtPayload } from 'jsonwebtoken';
import pick from '@/shared/pick';
import { searchAndFilterAbleFields } from './constants';
import { paginationFields } from '@/constants/pagination';

const add: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const employeeData = req.body;
  const result = await EmployeeServices.add(userId, employeeData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Inform the employee to check his/her email for credentials!',
    data: result,
  });
});

const getDetails: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id
  const result = await EmployeeServices.getDetails(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employee Details Information retvied succesfully',
    data: result,
  });
});


const get: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload
  const pagination = pick(req.query, paginationFields);
  const filters = pick(req.query, searchAndFilterAbleFields);
  const result = await EmployeeServices.get({user, pagination, filters});

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employee Information retvied',
    data: result,
  });
});

const getSelectOptions: RequestHandler = catchAsync(async (req, res) => {
  const { department } = req.params;
  const user = req.user as JwtPayload
  const result = await EmployeeServices.getSelectOptions(user, department);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Information retvied succesfully',
    data: result,
  });
});

const update: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const empData = req.body;
  const userId = req?.user?.userId;
  const result = await EmployeeServices.update(userId, id, empData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employee Information updated succesfully',
    data: result,
  });
});

export const EmployeeControllers = {
  add,
  update,
  get,
  getDetails,
  getSelectOptions,
};
