/* eslint-disable @typescript-eslint/no-this-alias */
import { ENUM_MANAGER_STATUS } from '@/enums/manager';
import { model, Schema } from 'mongoose';
import { IManager, ManagerModel } from './interface';

const managerSchema = new Schema<IManager>(
  {
    employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    status: {
      type: String,
      enum: Object.values(ENUM_MANAGER_STATUS),
      default: ENUM_MANAGER_STATUS.ACTIVE,
    },
  },
  { timestamps: true }
);

managerSchema.statics.isManagerExist = async function (employee: string) {
  const isExist = await Manager.findOne({
    employee,
    status: ENUM_MANAGER_STATUS.ACTIVE,
  });
  return isExist;
};

const Manager = model<IManager, ManagerModel>('Manager', managerSchema);

export default Manager;
