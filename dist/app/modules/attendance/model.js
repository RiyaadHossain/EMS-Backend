"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = require("mongoose");
const attendanceSchema = new mongoose_1.Schema({
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
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
}, { timestamps: true });
const Attendance = (0, mongoose_1.model)('Attendance', attendanceSchema);
exports.default = Attendance;
