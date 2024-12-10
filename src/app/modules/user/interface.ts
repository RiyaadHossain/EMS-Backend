/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Model, Types } from 'mongoose';
import { ENUM_USER_ROLE } from '@/enums/user';
import { IEmployee } from '../employee/interface';

export type IUser = {
  userId: string;
  name?: string;
  email: string;
  role: ENUM_USER_ROLE;
  phone: string;
  address: string;
  password: string;
  passwordChanged?: boolean
};

export interface UserModel extends Model<IUser> {
  isUserExist(id: string): Promise<IUser> | null;
  isPasswordMatched(givenPass: string, savedPass: string): Promise<boolean>;
  getRoleSpecificDetails(
    id: string
  ): Promise<
    | (IEmployee & { _id: Types.ObjectId })
    | null
  >;
}

export type IEmailPayload = {
  userId: string
  email: string
  password: string
  companyName?: string
  name?: string
}
