/* eslint-disable @typescript-eslint/ban-ts-comment */
import catchAsync from '@/shared/catchAsync';
import { RequestHandler } from 'express';
import sendResponse from '@/shared/sendResponse';
import httpStatus from 'http-status';
import { DepartmentServices } from './services';

const get: RequestHandler = catchAsync(async (req, res) => {
  const result = await DepartmentServices.get();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department Information retvied succesfully',
    data: result,
  });
});

const getSelectOptions: RequestHandler = catchAsync(async (req, res) => {
  const result = await DepartmentServices.getSelectOptions();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department Information retvied succesfully',
    data: result,
  });
});

const add: RequestHandler = catchAsync(async (req, res) => {
  const employeeData = req.body;
  const result = await DepartmentServices.add(employeeData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department data added succesfully!',
    data: result,
  });
});

const update: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id
  const employeeData = req.body;
  const result = await DepartmentServices.update(id, employeeData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department data updated succesfully!',
    data: result,
  });
});

const remove: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id
  const result = await DepartmentServices.remove(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Department data removed succesfully!',
    data: result,
  });
});


export const DepartmentControllers = {
  get,getSelectOptions,
  add,update, remove
};
