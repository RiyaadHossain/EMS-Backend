/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Model, Types } from "mongoose"

export type IAttendance = {
    month: number
    year: number
    user: Types.ObjectId
    day01: boolean;
    day02: boolean;
    day03: boolean;
    day04: boolean;
    day05: boolean;
    day06: boolean;
    day07: boolean;
    day08: boolean;
    day09: boolean;
    day10: boolean;
    day11: boolean;
    day12: boolean;
    day13: boolean;
    day14: boolean;
    day15: boolean;
    day16: boolean;
    day17: boolean;
    day18: boolean;
    day19: boolean;
    day20: boolean;
    day21: boolean;
    day22: boolean;
    day23: boolean;
    day24: boolean;
    day25: boolean;
    day26: boolean;
    day27: boolean;
    day28: boolean;
    day29: boolean;
    day30: boolean;
    day31: boolean;
}

export interface AttendanceModel extends Model<IAttendance> {
    isUserExist(id: string): Promise<IAttendance> | null;
}