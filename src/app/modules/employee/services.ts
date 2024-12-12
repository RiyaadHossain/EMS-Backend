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
import { NotificationServices } from '../notification/services';
import Project from '../project/model';

const add = async (adminId: string, payload: IUser & IEmployee) => {
  const admin = await User.findOne({ userId: adminId })
  if(!admin) throw new ApiError(httpStatus.BAD_REQUEST, "Admin account not found")

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

  await NotificationServices.add({from: admin._id,to: user._id, text: "Welcome, You're onboarded."})

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


const getDetails = async (id:string) => {
  const employee: any = await Employee.findById(id).populate('user').lean();
  if (!employee)
    throw new ApiError(httpStatus.BAD_REQUEST, "No employee account found")

  employee['projects'] = await Project.find({department: employee.department})

  return employee;
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

const update = async (userId: string, id: string, empData: IEmployee) => {
  const admin = await User.findOne({ userId })
  if(!admin) throw new ApiError(httpStatus.BAD_REQUEST, "Admin account not found")

  const emp = await Employee.findById(id);
  if (!emp)
    throw new ApiError(httpStatus.BAD_REQUEST, "Employee doesn't exist!");

  let dept = null;
  if (empData?.department) {
    dept = await Department.findById(empData.department);
    if (!dept)
      throw new ApiError(httpStatus.BAD_REQUEST, "Department doesn't exist!");
  }

  const user = await User.findById(emp.user)
  if (!user)
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exist!");

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

    user.role = ENUM_USER_ROLE.MANAGER 
    await user.save()
  }

  if (empData?.designation != ENUM_DESIGNATION.MANAGER) {
    emp.designation = empData.designation
    user.role = ENUM_USER_ROLE.EMPLOYEE
    await emp.save()
    await user.save()
    await Department.findByIdAndUpdate(emp.department, {manager: null})
    await Manager.updateMany({employee: emp._id}, {status: ENUM_MANAGER_STATUS.IN_ACTIVE})
  }

  await NotificationServices.add({from: admin._id, to: user._id, text: `Again log in! Admin has changed your information.`})

  return await Employee.findByIdAndUpdate(id, empData, { new: true });
};

export const EmployeeServices = {
  add,
  getSelectOptions,
  get,
  getDetails,
  update,
};
