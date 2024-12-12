import { getTotalDaysInMonth, twoDigitDay } from '@/utils/date';
import { JwtPayload } from 'jsonwebtoken';
import Attendance from './model';
import User from '../user/model';
import ApiError from '@/errors/ApiError';
import httpStatus from 'http-status';

const stats = async () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // Get total days in the current month
  const totalDays = getTotalDaysInMonth(year, month);
  const resData: any = { month, year };
  Array.from({ length: totalDays }, (_, index) => index + 1).forEach(day => {
    resData[twoDigitDay(day)] = 0;
  });

  const attendanceSheet = await Attendance.find({ month }).populate('user');
  attendanceSheet.forEach(attd => {
    Array.from({ length: totalDays }, (_, index) => index + 1).forEach(day => {
      //@ts-ignore
      resData[twoDigitDay(day)] += attd[twoDigitDay(day)];
    });
  });

  return resData;
};

const employeeSheet = async () => {
  const today = new Date();
  const month = today.getMonth();
  const sheetData = await Attendance.find({ month }).populate('user')
  return sheetData
};

const mySheet = async (user: JwtPayload) => {
  const myData = await User.getRoleSpecificDetails(user.userId)
  if (!myData)
      throw new ApiError(httpStatus.BAD_REQUEST, "User not found!")

  const today = new Date();
  const month = today.getMonth();
  const sheetData = await Attendance.findOne({ month, user: myData._id })
  return sheetData
};

const attdStatus = async (user: JwtPayload) => {
  const myData = await User.getRoleSpecificDetails(user.userId)
  if (!myData)
      throw new ApiError(httpStatus.BAD_REQUEST, "User not found!")

  const today = new Date();
  const date = today.getDate();
  const mysheetData = await mySheet(user)
  //@ts-ignore
  return {'status': mysheetData[twoDigitDay(date)]}
};

const confirmAttendance = async (user: JwtPayload) => {
  const myData = await User.getRoleSpecificDetails(user.userId)
  if (!myData)
      throw new ApiError(httpStatus.BAD_REQUEST, "User not found!")

  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  const currDay = { [twoDigitDay(date)]: true }
  const sheetData = await Attendance.findOneAndUpdate({ month, year, user: myData._id }, currDay, { new: true }).populate('user')
  return sheetData
};

export const AttendanceServices = {
  stats,
  employeeSheet,
  mySheet,
  attdStatus,
  confirmAttendance,
};
