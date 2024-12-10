/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { ENUM_DESIGNATION } from '@/enums/designation';
import { Model, Types } from 'mongoose';

export type IEmployee = {
  user: Types.ObjectId
  department: Types.ObjectId
  designation: ENUM_DESIGNATION
};

export interface EmployeeModel extends Model<IEmployee> {
  isEmployeeExist(email: string): Promise<IEmployee> | null;
}
