import { ENUM_MANAGER_STATUS } from '@/enums/manager';
import Manager from './model';
import Project from '../project/model';
import { formatDate } from '@/utils/date';
import ApiError from '@/errors/ApiError';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import User from '../user/model';
import Department from '../department/model';

const get = async () => {
  const managers: any = await Manager.find({
    status: ENUM_MANAGER_STATUS.ACTIVE,
  }).populate([
    {
      path: 'employee',
      populate: { path: 'user' },
    },
    {
      path: 'employee',
      populate: { path: 'department' },
    },
  ]);

  const resData: any = [];

  //@ts-ignore
  managers.forEach(manager =>
    resData.push({
      _id: manager._id,
      name: manager.employee.user.name,
      phone: manager.employee.user.phone,
      email: manager.employee.user.email,
      employeeId: manager.employee._id,
      department: manager.employee.department.name,
      departmentId: manager.employee.department._id,
      designation: manager.employee.designation,
      user: manager.employee.user,
    })
  );

  return resData;
};

const getDetails = async (id: string) => {
  const manager: any = await Manager.findById(id).populate([
    {
      path: 'employee',
      populate: { path: 'user' },
    },
    {
      path: 'employee',
      populate: { path: 'department' },
    },
  ]);

  if (!manager) throw new ApiError(httpStatus.BAD_REQUEST, 'No manager found');

  const resData: any = {
    name: manager?.employee?.user?.name,
    email: manager?.employee?.user?.email,
    department: manager?.employee?.department?.name,
    departmentId: manager?.employee?.department?._id,
    employeeId: manager?.employee?._id,
    designation: manager?.employee.designation,
    phone: manager?.employee?.user?.phone,
    address: manager?.employee?.user?.address || 'No Address',
    joinedAt: formatDate(manager?.employee?.user?.createdAt),
  };

  //@ts-ignore
  resData['projects'] = await Project.find({ manager: manager._id });
  return resData;
};

const getSelectOptions = async () => {
  const managers = await Manager.find().populate({
    path: 'employee',
    populate: { path: 'user' },
  });

  const optionsData: any = [];
  managers.forEach(manager =>
    //@ts-ignore
    optionsData.push({ label: manager.employee.user.name, value: manager._id })
  );

  return managers;
};

const getMyManager = async (user: JwtPayload) => {
  const userData = await User.getRoleSpecificDetails(user.userId);
  if (!userData) throw new ApiError(httpStatus.BAD_REQUEST, 'No user found!');

  const dept: any = await Department.findById(userData?.employee?.department?._id).populate(
    {
      path: 'manager',
      populate: { path: 'employee', populate: 'user' },
    }
  );

  const manager = {
    name: dept?.manager?.employee?.user?.name,
    user: dept?.manager?.employee?.user,
    email: dept?.manager?.employee?.user?.email,
    phone: dept?.manager?.employee?.user?.phone,
    department: dept?.name,
  };

  return manager;
};

export const ManagerServices = {
  get,
  getDetails,
  getSelectOptions,
  getMyManager,
};
