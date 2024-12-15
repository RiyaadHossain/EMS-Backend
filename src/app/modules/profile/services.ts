import { JwtPayload } from 'jsonwebtoken';
import { IUser } from '../user/interface';
import User from '../user/model';
import ApiError from '@/errors/ApiError';
import httpStatus from 'http-status';
import { formatDate } from '@/utils/date';
import { ENUM_USER_ROLE } from '@/enums/user';
import { Types } from 'mongoose';
import Manager from '../manager/model';
import Project from '../project/model';

const me = async (user: JwtPayload) => {
    let userData: any = await User.getRoleSpecificDetails(user.userId);

  userData = {
    name: userData?.name || userData?.email,
    email: userData?.email,
    phone: userData?.phone,
    employee: userData?.employee,
    role: userData?.role,
    department: userData?.employee?.department?.name,
    address: userData?.address,
    joinedAt: formatDate(userData?.createdAt)
  };
    

  if (userData.role == ENUM_USER_ROLE.MANAGER) {

    const managerIds: Types.ObjectId[] = []
    const managerDocs = await Manager.find({ employee: userData?.employee?._id })
    managerDocs.forEach(manager => managerIds.push(manager._id))

    userData['projects'] = await Project.find({
      manager: {'$in': managerIds},
    });
  }

  return userData;
};

const update = async (user: JwtPayload, data: IUser) => {
  const userData = await User.getRoleSpecificDetails(user.userId);
  if (!userData) throw new ApiError(httpStatus.BAD_REQUEST, 'No User found!');

  const updatedData = await User.findByIdAndUpdate(userData._id, data, {
    new: true,
  });
  return updatedData;
};

export const ProfileServices = { me, update };
