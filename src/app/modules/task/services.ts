import { JwtPayload } from 'jsonwebtoken';
import { ITask } from './interface';
import Project from '../project/model';
import ApiError from '@/errors/ApiError';
import httpStatus from 'http-status';
import Task from './model';
import User from '../user/model';
import Employee from '../employee/model';
import { ENUM_USER_ROLE } from '@/enums/user';
import hasOtherFields from '@/utils/object';

const get = async (user: JwtPayload) => {
  const { userId } = user;
  const userDetails = await User.getRoleSpecificDetails(userId);
  if (!userDetails)
    throw new ApiError(httpStatus.BAD_REQUEST, 'User data not found!');

  const tasks = await Task.find({ assignedTo: userDetails?.employee._id });
  return tasks;
};

const getByProject = async (projectId: string) => {
  const project = await Project.findById(projectId);
  if (!project)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Project is not exist!');

  const tasks = await Task.find({ project: project._id }).populate({
    path: 'assignedTo',
    populate: { path: 'user' },
  });
  return tasks;
};

const add = async (userId: string, taskData: ITask) => {
  const { project: projectId, assignedTo } = taskData;
  const project = await Project.findById(projectId);
  if (!project)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Project is not exist!');

  const employee = await Employee.findById(assignedTo);
  if (!employee)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Employee account doesn't not exist!"
    );

  // const user = await User.getRoleSpecificDetails(userId)
  // if (user?.manager._id != project.manager)
  //   throw new ApiError(httpStatus.BAD_REQUEST, "You're not authorized to update this project")

  const task = await Task.create(taskData);
  return task;
};

const update = async (user: JwtPayload, id: string, taskData: ITask) => {
  const task = await Task.findById(id).populate('project');
  if (!task) throw new ApiError(httpStatus.BAD_REQUEST, 'Task is not exist!');

  // const userData = await User.getRoleSpecificDetails(user.userId)
  // //@ts-ignore
  // if (userData?.manager._id != task.project.manager)
  //   throw new ApiError(httpStatus.BAD_REQUEST, "You're not authorized to update this task")
  
  // if(user.role == ENUM_USER_ROLE.EMPLOYEE && task.assignedTo != userData.employee._id)
    //   throw new ApiError(httpStatus.BAD_REQUEST, "You're not authorized to update this task")

  if (user.role === ENUM_USER_ROLE.MANAGER && hasOtherFields(taskData, ['name', 'assignedTo'])) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You only can edit name or assignedTo!'
    );
  }

  if (
    user.role === ENUM_USER_ROLE.EMPLOYEE &&
    hasOtherFields(taskData, ['status'])
  )
    throw new ApiError(httpStatus.BAD_REQUEST, 'You only can edit status!');

  return await Task.findByIdAndUpdate(id, taskData, { new: true });
};

const remove = async (id: string) => {
  const task = await Task.findById(id);
  if (!task) throw new ApiError(httpStatus.BAD_REQUEST, 'Task is not exist!');

  return await Task.findByIdAndDelete(id);
};

export const TaskServices = {
  get,
  getByProject,
  add,
  update,
  remove,
};
