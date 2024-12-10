/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Model, Types } from 'mongoose';

export type IDepartment = {
  name: string
  manager?: Types.ObjectId
};

export interface DepartmentModel extends Model<IDepartment> {
  isDepartmentExist(name: string): Promise<IDepartment> | null;
}

export type IDepartmentRes = {
  totalEmployee?: number
} & IDepartment

export type IDepartmentPayload = {
  name: string
  employee: Types.ObjectId
};