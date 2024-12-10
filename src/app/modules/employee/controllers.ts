/* eslint-disable @typescript-eslint/ban-ts-comment */
import catchAsync from '@/shared/catchAsync';
import { RequestHandler } from 'express';
import sendResponse from '@/shared/sendResponse';
import httpStatus from 'http-status';
import { EmployeeServices } from './services';

const add: RequestHandler = catchAsync(async (req, res) => {
  const employeeData = req.body;
  const result = await EmployeeServices.add(employeeData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Inform the employee to check his/her email for credentials!',
    data: result,
  });
});

const get: RequestHandler = catchAsync(async (req, res) => {
  //@ts-ignore
  const result = await EmployeeServices.get(req.user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Employee Information retvied',
    data: result,
  });
});

const getSelectOptions: RequestHandler = catchAsync(async (req, res) => {
  const {department} = req.params
  const result = await EmployeeServices.getSelectOptions(department);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Information retvied succesfully',
    data: result,
  });
});

const update: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params
  const empData = req.body
  const result = await EmployeeServices.update(id, empData);

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
  getSelectOptions,
};
