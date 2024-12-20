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
import Employee from '../employee/model';
import { NotificationServices } from '../notification/services';
import { SortOrder, Types } from 'mongoose';
import { IPagination } from '@/interfaces/pagination';
import { IFilters } from '@/interfaces/common';
import { paginationHelpers } from '@/helpers/paginationHelper';
import { searchableFields } from './constants';
import { calculateDateDifference, formatDate } from '@/utils/date';

const get = async (user: JwtPayload,
  pagination: IPagination,
  filters: IFilters) => {
  const { userId, role } = user;

  const andConditions = [];
  if (role == ENUM_USER_ROLE.MANAGER){
    const query: any = {};
    query['manager'] = (
      await User.getRoleSpecificDetails(userId)
    )?.manager?._id;
    andConditions.push(query)
}
  
    const { page, limit, skip, sortOrder, sortBy } =
    paginationHelpers.calculatePagination(pagination);

  if (role == ENUM_USER_ROLE.MANAGER) {
    const query: any = {};
    query['department'] = (
      await User.getRoleSpecificDetails(userId)
    )?.employee?.department;
    andConditions.push(query);
  }

  // Sort condition
  const sortCondition: { [key: string]: SortOrder } = {};
  sortCondition[sortBy] = sortOrder;

  // Filter Options
  const { searchTerm, ...filtersData } = filters;

  if (searchTerm) {
    andConditions.push({
      $or: searchableFields.map(field => ({
        [field]: { '$regex': searchTerm, '$options': 'i' },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]:  value,
      })),
    });
  }

  const whereCondition = andConditions.length ? { $and: andConditions } : {};

  let projects:any = await Project.find(whereCondition)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit)
    .populate([
      {
        path: 'department',
        populate: {
          path: 'manager',
          populate: { path: 'employee', populate: 'user' },
        },
      },
    ])
    .lean();

  projects = projects.map((project:any) => ({
      id: project._id,
      projectName: project.name,
      department: project?.department?.name,
      manager: project?.department?.manager?.employee?.user?.name,
      managerId: project?.department?.manager?._id,
      employeeId: project?.department?.manager?.employee?._id,
      issueDate: formatDate(project?.issueDate),
      expectedEndDate: formatDate(project?.expectedEndDate),
      plainExpectedEndDate: project?.expectedEndDate,
      status: project?.status,
    }))

  const total = await Project.countDocuments(whereCondition);
  const totalPages = Math.ceil(total / limit);

  const meta = { total, page, limit, totalPages };

  return { meta, data: projects };
};

const getDetails = async (id: string) => {
  const project:any = await Project.findById(id).populate([{
    path: 'manager',
    populate: {
      path: 'employee',
      populate: {
        path: 'user',
      },
    },
  }, {path: 'department'}]).lean();

  if (!project)
    throw new ApiError(httpStatus.BAD_REQUEST, 'No project account found');

  const resData: any = {
    name: project.name,
  issueDate: formatDate(project.issueDate),
  expectedEndDate: formatDate(project.expectedEndDate),
  plainExpectedEndDate: project?.expectedEndDate,
  department: project.department,
  manager: project.manager.employee.user,
  status: project.status,
  duration: calculateDateDifference(project.issueDate, project.expectedEndDate),
  }

  //@ts-ignore
  resData['tasks'] = await Task.find({project: project._id}).populate({path: 'assignedTo', populate: { path: 'user' }})

  return resData;
};

const getSelectOptions = async (user: JwtPayload) => {
  const { userId } = user;

  const userData = await User.getRoleSpecificDetails(userId);
  if (!userData)
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist!");

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

const add = async (userId: string, projectData: IProject) => {
  const admin = await User.findOne({ userId });
  if (!admin)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin account not found');

  const { department } = projectData;

  const dept = await Department.findById(department);
  if (!dept)
    throw new ApiError(httpStatus.BAD_REQUEST, "Department doesn't exist!");

  if (!dept.manager)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Manager is not assigned to ${dept.name} department!`
    );

  const from = admin._id;
  const text = `Project ${projectData.name} has been initialized under your department.`;
  const employees = await Employee.find({ department: department }).populate(
    'user'
  );
  Promise.all(
    employees.map(
      async emp =>
        await NotificationServices.add({ from, to: emp.user._id, text })
    )
  );

  projectData.manager = dept.manager;
  projectData.status = ENUM_PROJECT_STATUS.TO_DO;
  const project = await Project.create(projectData);
  return project;
};

const update = async (user: JwtPayload, id: string, projectData: IProject) => {
  const { userId, role } = user;

  const userData = await User.findOne({ userId });
  if (!userData)
    throw new ApiError(httpStatus.BAD_REQUEST, 'User account not found');

  const projectExist = await Project.findById(id);
  if (!projectExist)
    throw new ApiError(httpStatus.BAD_REQUEST, "Project Doesn't Exist!");

  const isManager = role === ENUM_USER_ROLE.MANAGER;
  const isAdmin = role === ENUM_USER_ROLE.ADMIN;

  if (isAdmin && hasOtherFields(projectData, ['name', 'expectedEndDate']))
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You only can edit name / end date'
    );

  if (isManager && hasOtherFields(projectData, ['status']))
    throw new ApiError(httpStatus.BAD_REQUEST, 'You only can edit status');

  // Notification Sending -> start
  const from = userData._id;
  const adminText = `Project '${projectExist.name}' details has been updated`;
  const managerText = `Project '${projectExist.name}' status has been updated`;
  const employees = await Employee.find({
    department: projectExist.department,
  }).populate('user');
  const admins = await User.find({ role: ENUM_USER_ROLE.ADMIN });

  if (isAdmin)
    Promise.all(
      employees.map(
        async emp =>
          await NotificationServices.add({
            from,
            to: emp.user._id,
            text: adminText,
          })
      )
    );

  const userIds: Types.ObjectId[] = [];
  employees.forEach(emp => userIds.push(emp.user._id));
  admins.forEach(admin => userIds.push(admin._id));

  //@ts-ignore
  if (isManager)
    Promise.all(
      userIds.map(
        async id =>
          await NotificationServices.add({
            from,
            to: id,
            text: managerText,
          })
      )
    );
  // Notification Sending -> end

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
  getDetails,
  getSelectOptions,
  add,
  update,
  remove,
};
