/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { ENUM_MANAGER_STATUS } from '@/enums/manager';
import { Model, Types } from 'mongoose';

export type IManager = {
  _id?: Types.ObjectId
  employee: Types.ObjectId;
  status: ENUM_MANAGER_STATUS;
};

export interface ManagerModel extends Model<IManager> {
  isManagerExist(employeeId: Types.ObjectId): Promise<IManager> | null;
}
