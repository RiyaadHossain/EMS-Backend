import ApiError from '@/errors/ApiError';
import { IUser } from '../user/interface';
import User from '../user/model';
import { IEmployee } from './interface';
import Employee from './model';
import httpStatus from 'http-status';
import { UserUtils } from '../user/utils';
import { ENUM_USER_ROLE } from '@/enums/user';
import { EmployeeUtils } from './utils';
import { JwtPayload } from 'jsonwebtoken';
import { ENUM_DESIGNATION } from '@/enums/designation';
import Department from '../department/model';
import Manager from '../manager/model';
import { ENUM_MANAGER_STATUS } from '@/enums/manager';

const add = async (payload: IUser & IEmployee) => {
  const { designation, department } = payload;
  const isExist = await Employee.isEmployeeExist(payload.email);
  if (isExist)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Employee with the same email already exist!'
    );

  const dept = await Department.findById(department);
  if (!dept)
    throw new ApiError(httpStatus.BAD_REQUEST, "Department doesn' exist!");

  if (designation == ENUM_DESIGNATION.MANAGER && dept?.manager)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This Department already has a manager'
    );

  //  Generate userId and hash password
  const userId = await UserUtils.generateId(ENUM_USER_ROLE.EMPLOYEE);
  const password = UserUtils.generatePassword();

  const { name, email, phone, address } = payload;
  const role =
    designation == ENUM_DESIGNATION.MANAGER
      ? ENUM_USER_ROLE.MANAGER
      : ENUM_USER_ROLE.EMPLOYEE;
  const userPaylod: IUser = {
    name,
    userId,
    email,
    phone,
    address,
    password,
    role,
  };

  const user = await User.create(userPaylod);
  if (!user)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user account');

  const employeePayload: IEmployee = {
    user: user._id,
    department: department,
    designation: designation,
  };
  const employee = await Employee.create(employeePayload);

  if (designation === ENUM_DESIGNATION.MANAGER) {
    const manager = await Manager.create({
      employee: employee._id,
      status: ENUM_MANAGER_STATUS.ACTIVE,
    });

    dept.manager = manager._id;
    await dept.save();
  }

  // Send Confirmation Email to User
  await EmployeeUtils.onboardEmloyeeEmail({ email, userId, password });
};

const get = async (payload: JwtPayload) => {
  const { role, userId } = payload;

  const query: any = {};
  if (role == ENUM_USER_ROLE.MANAGER)
    query['department'] = (
      await User.getRoleSpecificDetails(userId)
    )?.employee?.department;
  
  console.log(query);

  const employees = Employee.find(query).populate('department user');
  return employees;
};

const getSelectOptions = async (department: string) => {
  const selectOptins: any = [];
  const employees = await Employee.find({ department }).populate('user');

  employees.forEach(employee =>
    //@ts-ignore
    selectOptins.push({ label: employee.user.name, value: employee._id })
  );
  return selectOptins;
};

const update = async (id: string, empData: IEmployee) => {
  const emp = await Employee.findById(id);
  if (!emp)
    throw new ApiError(httpStatus.BAD_REQUEST, "Employee doesn' exist!");

  let dept = null;
  if (empData?.department) {
    dept = await Department.findById(empData.department);
    if (!dept)
      throw new ApiError(httpStatus.BAD_REQUEST, "Department doesn't exist!");
  }

  if (empData?.designation === ENUM_DESIGNATION.MANAGER) {
    if (!dept && !emp.department) throw new ApiError(httpStatus.BAD_REQUEST, "Please Select a Department!");
    
    if (!dept)
      dept = await Department.findById(emp.department)

    if (!dept)
      throw new ApiError(httpStatus.BAD_REQUEST, "Department not found!")

    if (dept?.manager)
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Department has already a manager!'
      );

    const manager = await Manager.create({
      employee: emp._id,
      status: ENUM_MANAGER_STATUS.ACTIVE,
    });
    
    dept.manager = manager._id
    await dept.save()

    await User.findByIdAndUpdate(emp.user, { role: ENUM_USER_ROLE.MANAGER });
  }

  return await Employee.findByIdAndUpdate(id, empData, { new: true });
};

export const EmployeeServices = {
  add,
  getSelectOptions,
  get,
  update,
};
