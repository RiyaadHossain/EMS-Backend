/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from 'mongoose';

import { IAttendance, AttendanceModel } from './interface';

const attendanceSchema = new Schema<IAttendance>(
  {
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    day01: { type: Boolean, default: false },
    day02: { type: Boolean, default: false },
    day03: { type: Boolean, default: false },
    day04: { type: Boolean, default: false },
    day05: { type: Boolean, default: false },
    day06: { type: Boolean, default: false },
    day07: { type: Boolean, default: false },
    day08: { type: Boolean, default: false },
    day09: { type: Boolean, default: false },
    day10: { type: Boolean, default: false },
    day11: { type: Boolean, default: false },
    day12: { type: Boolean, default: false },
    day13: { type: Boolean, default: false },
    day14: { type: Boolean, default: false },
    day15: { type: Boolean, default: false },
    day16: { type: Boolean, default: false },
    day17: { type: Boolean, default: false },
    day18: { type: Boolean, default: false },
    day19: { type: Boolean, default: false },
    day20: { type: Boolean, default: false },
    day21: { type: Boolean, default: false },
    day22: { type: Boolean, default: false },
    day23: { type: Boolean, default: false },
    day24: { type: Boolean, default: false },
    day25: { type: Boolean, default: false },
    day26: { type: Boolean, default: false },
    day27: { type: Boolean, default: false },
    day28: { type: Boolean, default: false },
    day29: { type: Boolean, default: false },
    day30: { type: Boolean, default: false },
    day31: { type: Boolean, default: false },
  },
  { timestamps: true }
);


const Attendance = model<IAttendance, AttendanceModel>('Attendance', attendanceSchema);

export default Attendance;
