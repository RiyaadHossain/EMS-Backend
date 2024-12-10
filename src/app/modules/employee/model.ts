/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';
import { EmployeeModel, IEmployee } from './interface';
import { ENUM_DESIGNATION } from '@/enums/designation';
import User from '../user/model';

const employeeSchema = new Schema<IEmployee>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  department: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  designation: {
    type: String,
    enum: Object.values(ENUM_DESIGNATION),
  },
}, { timestamps: true });

employeeSchema.statics.isEmployeeExist = async function (email: string) {
  const isExist = await User.findOne({ email });
  return isExist;
};

const Employee = model<IEmployee, EmployeeModel>('Employee', employeeSchema);

export default Employee;
