import { ENUM_MANAGER_STATUS } from '@/enums/manager';
import ApiError from '@/errors/ApiError';
import httpStatus from 'http-status';
import Employee from '../employee/model';
import Manager from '../manager/model';
import { IDepartment, IDepartmentPayload, IDepartmentRes } from './interface';
import Department from './model';
import { ENUM_DESIGNATION } from '@/enums/designation';
import User from '../user/model';
import { ENUM_USER_ROLE } from '@/enums/user';
import Project from '../project/model';

const get = async () => {
  const departments = await Department.find().populate({
    path: 'manager',
    populate: {
      path: 'employee',
      populate: 'user',
    },
  });

  const populatedDepartments = await Promise.all(
    departments.map(async (dept: IDepartmentRes) => {
      const totalEmployee = await Employee.find({
        //@ts-ignore
        demaptment: dept._id,
      }).countDocuments();

      //@ts-ignore
      return { ...dept._doc, totalEmployee };
    })
  );

  return populatedDepartments;
};

const getDetails = async (id:string) => {
  const department:any = await Department.findById(id).populate({
    path: 'manager',
    populate: {
      path: 'employee',
      populate: 'user',
    },
  }).lean();

  if (!department)
    throw new ApiError(httpStatus.BAD_REQUEST, "No Department found!")

  department['projects'] = await Project.find({department: department._id})
  department['totalEmployee'] = await Employee.find({department: department._id}).countDocuments()

  return department;
};

const getSelectOptions = async () => {
  const selectOptins: any = [];
  const departments = await Department.find();

  departments.forEach(dept =>
    selectOptins.push({ label: dept.name, value: dept._id })
  );
  return selectOptins;
};

const add = async (payload: IDepartmentPayload) => {
  const deptPayload: IDepartment = { name: payload.name };
  const department = await Department.create(deptPayload);
  return department;
};

const update = async (
  id: string,
  payload: IDepartmentPayload & IDepartment
) => {
  const { employee } = payload;
  const dept = await Department.findById(id);
  if (!dept)
    throw new ApiError(httpStatus.BAD_REQUEST, "The department doesn't exist!");

  if (payload?.employee) {
    const employeeData = await Employee.findById(payload.employee);
    if (!employeeData)
      throw new ApiError(httpStatus.BAD_REQUEST, "The employee doesn't exist!");

    const manager = await Manager.findOne({ employee, status: ENUM_MANAGER_STATUS.ACTIVE })
    console.log(employee);
    console.log(manager);
    if (manager)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'The employee already is a manager!'
      );

    const prevManager = await Manager.findByIdAndUpdate(dept.manager, {
      status: ENUM_MANAGER_STATUS.IN_ACTIVE,
    }).populate('employee');

    //@ts-ignore
    await User.findByIdAndUpdate(prevManager?.employee?.user, {
      role: ENUM_USER_ROLE.EMPLOYEE,
    });
    await Employee.findByIdAndUpdate(prevManager?.employee?._id, {
      designation: ENUM_DESIGNATION.MEMBER,
    });

    await Employee.findByIdAndUpdate(employee, {
      department: dept._id,
      designation: ENUM_DESIGNATION.MANAGER,
    });
    await User.findByIdAndUpdate(employeeData.user, {
      role: ENUM_USER_ROLE.MANAGER,
    });

    const newManager = await Manager.create({ employee });
    payload.manager = newManager._id;
  }

  return await Department.findByIdAndUpdate(id, payload, { new: true });
};

const remove = async (id: string) => {
  const dept = await Department.findById(id);
  if (!dept)
    throw new ApiError(httpStatus.BAD_REQUEST, "The department doesn't exist!");

  const prevManager = await Manager.findByIdAndUpdate(dept.manager, {
    status: ENUM_MANAGER_STATUS.IN_ACTIVE,
  }).populate('employee');
  //@ts-ignore
  await User.findByIdAndUpdate(prevManager?.employee?.user, {
    role: ENUM_USER_ROLE.EMPLOYEE,
  });

  const employees = await Employee.find({ department: id });

  await Promise.all(
    employees.map(async emp => {
      const result = await Employee.findByIdAndUpdate(emp._id, {
        department: null,
        designation: ENUM_DESIGNATION.MEMBER,
      });

      console.log(result);
      return result;
    })
  );

  return await Department.findByIdAndDelete(id);
};

export const DepartmentServices = {
  get,
  getDetails,
  getSelectOptions,
  add,
  update,
  remove,
};
