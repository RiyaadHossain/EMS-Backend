/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { ENUM_DESIGNATION } from '@/enums/designation';
import { IFilters } from '@/interfaces/common';
import { IPagination } from '@/interfaces/pagination';
import { JwtPayload } from 'jsonwebtoken';
import { Model, Types } from 'mongoose';

export type IEmployee = {
  _id?: Types.ObjectId
  user: Types.ObjectId
  department: Types.ObjectId
  designation: ENUM_DESIGNATION
};

export interface EmployeeModel extends Model<IEmployee> {
  isEmployeeExist(email: string): Promise<IEmployee> | null;
}


export type GetProp = {
  user: JwtPayload;
  pagination: IPagination;
  filters: IFilters;
  department?: string | any;
};