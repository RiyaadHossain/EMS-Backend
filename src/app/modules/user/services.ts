import ApiError from '@/errors/ApiError';
import { ICompany } from '../company/interface';
import Company from '../company/model';
import httpStatus from 'http-status';
import { UserUtils } from './utils';
import { ENUM_USER_ROLE } from '@/enums/user';
import { IUser } from './interface';
import User from './model';
import { ENUM_COMPANY_STATUS } from '@/enums/company';

const register = async (payload: ICompany) => {
  // 1. Is user exist
  const isExist = await Company.findOne({
    status: ENUM_COMPANY_STATUS.ACTIVE,
    email: payload.email,
  });

  if (isExist)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Company account is already exist'
    );
  
  await Company.deleteMany({email:payload.email})
  await User.deleteMany({email:payload.email})

  // 3. Generate userId and hash password
  const userId = await UserUtils.generateId(ENUM_USER_ROLE.ADMIN);

  const password = UserUtils.generatePassword();
  const { email, phone, address } = payload;
  const userPaylod: IUser = {
    userId,
    email,
    phone,
    address,
    password,
    role: ENUM_USER_ROLE.ADMIN,
  };

  console.log(userId, password);

  const user = await User.create(userPaylod);
  if (!user)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user account');
  payload.admin = user._id
  await Company.create(payload)

  // 4. Send Confirmation Email to User
  await UserUtils.sendRegistrationEmail({email, userId, password });

};

export const UserServices = {
  register,
};
