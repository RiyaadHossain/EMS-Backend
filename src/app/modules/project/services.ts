import { JwtPayload } from 'jsonwebtoken';
import { IProject } from './interface';
import Project from './model';
import { ENUM_USER_ROLE } from '@/enums/user';
import User from '../user/model';
import Manager from '../manager/model';
import { ENUM_MANAGER_STATUS } from '@/enums/manager';
import Department from '../department/model';
import ApiError from '@/errors/ApiError';
import httpStatus from 'http-status';
import { ENUM_PROJECT_STATUS } from '@/enums/project';
import hasOtherFields from '@/utils/object';
import Task from '../task/model';

const get = async (user: JwtPayload) => {
  const { userId, role } = user;

  const query: any = {};
  if (role == ENUM_USER_ROLE.MANAGER)
    query['manager'] = (
      await User.getRoleSpecificDetails(userId)
    )?.manager?._id;

  const projects = await Project.find(query)
    .populate('department')
    .populate({
      path: 'manager',
      populate: {
        path: 'employee',
        populate: {
          path: 'user',
        },
      },
    });

  return projects;
};

const getSelectOptions = async (user: JwtPayload) => {
  const { userId } = user;

    const userData = await User.getRoleSpecificDetails(userId);
    if (!userData)
        throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist!")

  const manager = await Manager.find({
    employee: userData.employee._id,
    status: ENUM_MANAGER_STATUS.ACTIVE,
  });

  //@ts-ignore
  let projects: any = await Project.find({ manager: manager._id });

  projects = projects.map((projct: any) => ({
    label: projct.name,
    value: projct._id,
  }));

  return projects;
};

const add = async (projectData: IProject) => {
  const { department } = projectData;

  const dept = await Department.findById(department);
  if (!dept)
    throw new ApiError(httpStatus.BAD_REQUEST, "Department doesn't exist!");

  if (!dept.manager)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Manager is not assigned to ${dept.name} department!`
    );

  projectData.manager = dept.manager;
  projectData.status = ENUM_PROJECT_STATUS.TO_DO;

  const project = await Project.create(projectData);
  return project;
};

const update = async (role: string, id: string, projectData: IProject) => {
  if (
    role === ENUM_USER_ROLE.ADMIN &&
    hasOtherFields(projectData, ['name', 'exptectedEndDate'])
  )
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You only can edit name or end date'
    );

  if (
    role === ENUM_USER_ROLE.MANAGER &&
    hasOtherFields(projectData, ['status'])
  )
    throw new ApiError(httpStatus.BAD_REQUEST, 'You only can edit status');

  const project = await Project.findByIdAndUpdate(id, projectData, {
    new: true,
  });
  return project;
};

const remove = async (id: string) => {
  const projectExist = await Project.findById(id);
  if (!projectExist)
    throw new ApiError(httpStatus.BAD_REQUEST, "Project Doesn't Exist!");

  await Task.deleteMany({ project: projectExist._id });

  const project = await Project.findByIdAndDelete(id);
  return project;
};

export const ProjectServices = {
  get,
  getSelectOptions,
  add,
  update,
  remove,
};
