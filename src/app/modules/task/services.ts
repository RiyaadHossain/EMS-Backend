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
import { NotificationServices } from '../notification/services';
import { Types } from 'mongoose';

const get = async (user: JwtPayload) => {
  const { userId } = user;
  const userDetails = await User.getRoleSpecificDetails(userId);
  if (!userDetails)
    throw new ApiError(httpStatus.BAD_REQUEST, 'User data not found!');

  let tasks:any = await Task.find({ assignedTo: userDetails?.employee._id }).populate('project');
  tasks = tasks.map((task: any) => ({
    id: task._id,
    name: task.name,
    project: task.project,
    projectId: task.project._id,
    projectName: task.project.name,
    status: task.status
  }))

  return tasks;
};

const getByProject = async (projectId: string) => {
  const project = await Project.findById(projectId);
  if (!project)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Project is not exist!');

  let tasks: any = await Task.find({ project: project._id }).populate({
    path: 'assignedTo',
    populate: { path: 'user' },
  });

  tasks = tasks.map((task: any) => ({
    name: task.name,
    user: task?.assignedTo?.user,
    assignee: task?.assignedTo?.user?.name,
    status: task?.status,
  }));

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

  const user = await User.getRoleSpecificDetails(userId);
  if (!user)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Manager user account not found!'
    );

  // ToDo: Only Particular project manager can assign task
  // if (user?.manager._id != project.manager)
  //   throw new ApiError(httpStatus.BAD_REQUEST, "You're not authorized to update this project")

  await NotificationServices.add({
    from: user._id,
    to: employee.user,
    text: "You're assigned a Task.",
  });

  const task = await Task.create(taskData);
  return task;
};

const update = async (user: JwtPayload, id: string, taskData: ITask) => {
  const task = await Task.findById(id).populate([
    {
      path: 'project',
      populate: {
        path: 'manager',
        populate: {
          path: 'employee',
          populate: {
            path: 'user',
          },
        },
      },
    },
    {
      path: 'assignedTo',
      populate: {
        path: 'user',
      },
    },
  ]);

  if (!task) throw new ApiError(httpStatus.BAD_REQUEST, 'Task is not exist!');

  const userData = await User.getRoleSpecificDetails(user.userId);
  if (!userData)
    throw new ApiError(httpStatus.BAD_REQUEST, 'User account not found!');

  /*   
  ToDo: Only assigned manager and employee can update task 
  if (userData?.manager._id != task.project.manager)
    throw new ApiError(httpStatus.BAD_REQUEST, "You're not authorized to update this task")
  
  if(user.role == ENUM_USER_ROLE.EMPLOYEE && task.assignedTo != userData.employee._id)
      throw new ApiError(httpStatus.BAD_REQUEST, "You're not authorized to update this task") 
  */

  if (
    user.role === ENUM_USER_ROLE.MANAGER &&
    hasOtherFields(taskData, ['name', 'assignedTo'])
  ) {
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

  if (user.role === ENUM_USER_ROLE.EMPLOYEE)
    return updateStatus(userData._id, task, taskData.status);

  await NotificationServices.add({
    from: userData._id,
    //@ts-ignore
    to: task.assignedTo.user._id,
    text: `Task ${task.name} is updated`,
  });

  return await Task.findByIdAndUpdate(id, taskData, { new: true });
};

const updateStatus = async (
  employeeUserId: Types.ObjectId,
  task: ITask,
  status: string
) => {
  //@ts-ignore
  const managerUserId = task?.project?.manager?.employee?.user?._id;
  await NotificationServices.add({
    from: employeeUserId,
    to: managerUserId,
    text: `Task:${task.name} status has been updated`,
  });

  //@ts-ignore
  await Task.findByIdAndUpdate(task._id, { status }, { new: true });
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
