import { JwtPayload } from 'jsonwebtoken';
import Announcement from './model';
import User from '../user/model';
import ApiError from '@/errors/ApiError';
import httpStatus from 'http-status';
import { IAnnouncement } from './interface';
import { ENUM_USER_ROLE } from '@/enums/user';
import Employee from '../employee/model';
import Notification from '../notification/model';
import { IEmployee } from '../employee/interface';
import { Types } from 'mongoose';
import Department from '../department/model';
import Manager from '../manager/model';
import { timeAgo } from '@/utils/date';

const get = async (user: JwtPayload) => {
  const { userId, role } = user;

  const userDetails = await User.getRoleSpecificDetails(userId);
  if (!userDetails)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Uesr account not found!');

  let announcements: any[] = [];
  const announcers: Types.ObjectId[] = [];

  const admins = await User.find({ role: ENUM_USER_ROLE.ADMIN });
  admins.forEach(admin => announcers.push(admin._id));

  if (role == ENUM_USER_ROLE.MANAGER || role == ENUM_USER_ROLE.EMPLOYEE)
    announcers.push(userDetails._id);

  if (role == ENUM_USER_ROLE.EMPLOYEE) {
    const manager = (await Department.findById(userDetails.employee.department))
      ?.manager;

    if (!manager)
      throw new ApiError(httpStatus.BAD_REQUEST, "Manager couldn't find!");

    const managerDetails = await Manager.findById(manager._id).populate({
      path: 'employee',
      populate: { path: 'user' },
    });

    //@ts-ignore
    const managerUserId = managerDetails?.employee?.user?._id
    announcers.push(managerUserId);
  }

  announcements = await Announcement.find({ announcedBy: { $in: announcers } }).populate('announcedBy');
  announcements = announcements.map((announcement:any) => ({
    id: announcement._id,
    username: announcement?.announcedBy?.name,
    announcement: announcement.text,
    time: timeAgo(announcement.createdAt),
  }))

  return announcements;
};

const add = async (user: JwtPayload, payload: IAnnouncement) => {
  const { userId, role } = user;

  const userDetails = await User.getRoleSpecificDetails(userId);
  if (!userDetails)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Uesr account not found!');

  const from = userDetails._id;
  const text = `Alert! There is an announcement from ${role}`;

  if (role === ENUM_USER_ROLE.ADMIN) {
    const employees = await Employee.find().populate('user');

    Promise.all(
      employees.map(
        async emp => await Notification.create({ from, to: emp.user._id, text })
      )
    );
  }

  if (role === ENUM_USER_ROLE.MANAGER) {
    const allEmployees = await Employee.find({
      department: userDetails.employee.department,
    }).populate('user');

    const selectedEmployees: IEmployee[] = [];
    allEmployees.forEach(emp => {
      if (emp.user._id != userDetails._id) selectedEmployees.push(emp);
    });

    Promise.all(
      selectedEmployees.map(
        async emp => await Notification.create({ from, to: emp.user._id, text })
      )
    );
  }

  payload.announcedBy = userDetails._id;
  const announcements = await Announcement.create(payload);
  return announcements;
};

export const AnnouncementServices = {
  get,
  add,
};
