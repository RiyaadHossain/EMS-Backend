/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';
import { IUser, UserModel } from './interface';
import { ENUM_USER_ROLE } from '@/enums/user';
import bcrypt from 'bcrypt';
import config from '@/config';
import Employee from '../employee/model';
import Manager from '../manager/model';
import { ENUM_MANAGER_STATUS } from '@/enums/manager';

const userSchema = new Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: Object.values(ENUM_USER_ROLE),
    },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String },
    passwordChanged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// To Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.BCRYPT_SALT_ROUNDS)
  );

  next();
});

// To check User Password
userSchema.statics.isPasswordMatched = async function (
  givenPass: string,
  savedPass: string
) {
  const isPassMatched = await bcrypt.compare(givenPass, savedPass);

  return isPassMatched;
};

userSchema.statics.isUserExist = async function (id: string) {
  const isExist = await User.findById(id);
  return isExist;
};

userSchema.statics.getRoleSpecificDetails = async function (id: string) {
  const user = await User.findOne({ userId: id });

  const details: any = {};
  if (user?.role != ENUM_USER_ROLE.ADMIN) {
    const employee = await Employee.findOne({ user: user?._id });
    details['employee'] = employee;

    if (user?.role == ENUM_USER_ROLE.MANAGER) {
      const manager = await Manager.findOne({
        employee: employee?._id,
        status: ENUM_MANAGER_STATUS.ACTIVE,
      });
      details['manager'] = manager
    }

  }

  //@ts-ignore
  return { ...user._doc, ...details };
};

const User = model<IUser, UserModel>('User', userSchema);

export default User;
