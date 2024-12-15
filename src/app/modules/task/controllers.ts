import catchAsync from '@/shared/catchAsync';
import sendResponse from '@/shared/sendResponse';
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import { TaskServices } from './services';
import { JwtPayload } from 'jsonwebtoken';

const get: RequestHandler = catchAsync(async (req, res) => {
  const user = req.user as JwtPayload;
  const result = await TaskServices.get(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task Information retvied succesfully',
    data: result,
  });
});

const getByProject: RequestHandler = catchAsync(async (req, res) => {
  const {projectId} = req.params
  const result = await TaskServices.getByProject(projectId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task Information retvied succesfully',
    data: result,
  });
});

const add: RequestHandler = catchAsync(async (req, res) => {
  const userId = req.user?.userId
  const taskData = req.body;
  const result = await TaskServices.add(userId,taskData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task Information added succesfully',
    data: result,
  });
});

const update: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const taskData = req.body;
  const user = req.user as JwtPayload
  const result = await TaskServices.update(user, id, taskData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task Information updated succesfully',
    data: result,
  });
});

const remove: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await TaskServices.remove(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task Information retvied succesfully',
    data: result,
  });
});

export const TaskControllers = {
  get,
  getByProject,
  add,
  update,
  remove,
};
