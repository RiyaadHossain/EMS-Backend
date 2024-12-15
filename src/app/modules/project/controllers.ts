import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { ProjectServices } from './services';
import { JwtPayload } from 'jsonwebtoken';
import pick from '@/shared/pick';
import { paginationFields } from '@/constants/pagination';
import { searchAndFilterAbleFields } from './constants';

const get: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const pagination = pick(req.query, paginationFields);
  const filters = pick(req.query, searchAndFilterAbleFields);
  const result = await ProjectServices.get(user, pagination, filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project Information retvied succesfully',
    data: result,
  });
});


const getDetails: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id
  const result = await ProjectServices.getDetails(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project Details Information retvied succesfully',
    data: result,
  });
});


const getSelectOptions: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await ProjectServices.getSelectOptions(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project Information retvied succesfully',
    data: result,
  });
});

const add: RequestHandler = catchAsync(async (req, res) => {
  const projectData = req.body;
  const userId = req.user?.userId
  const result = await ProjectServices.add(userId, projectData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project Information added succesfully',
    data: result,
  });
});

const update: RequestHandler = catchAsync(async (req, res) => {
  //@ts-ignore
  const user = req.user as JwtPayload
  const id = req.params.id;
  const projectData = req.body;
  const result = await ProjectServices.update(user, id, projectData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project Information updated succesfully',
    data: result,
  });
});

const remove: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await ProjectServices.remove(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Project Information removed succesfully',
    data: result,
  });
});

export const ProjectControllers = {
  get,
  getDetails,
  add,
  update,
  remove,
  getSelectOptions,
};
