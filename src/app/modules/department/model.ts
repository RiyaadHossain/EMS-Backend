/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';
import User from '../user/model';
import { DepartmentModel, IDepartment } from './interface';

const departmentSchema = new Schema<IDepartment>({
  name: { type: String, required: true, unique: true },
  manager: { type: Schema.Types.ObjectId, ref: 'Manager' },
}, { timestamps: true });

departmentSchema.statics.isDepartmentExist = async function (email: string) {
  const isExist = await User.findOne({ email });
  return isExist;
};

const Department = model<IDepartment, DepartmentModel>('Department', departmentSchema);

export default Department;
