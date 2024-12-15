"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceServices = void 0;
const date_1 = require("../../../utils/date");
const model_1 = __importDefault(require("./model"));
const model_2 = __importDefault(require("../user/model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const model_3 = __importDefault(require("../employee/model"));
const stats = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    // Get total days in the current month
    const totalDays = (0, date_1.getTotalDaysInMonth)(year, month);
    const attData = { month, year };
    Array.from({ length: totalDays }, (_, index) => index + 1).forEach(day => {
        attData[(0, date_1.twoDigitDay)(day)] = 0;
    });
    const attendanceSheet = yield model_1.default.find({ month }).populate('user');
    attendanceSheet.forEach(attd => {
        Array.from({ length: totalDays }, (_, index) => index + 1).forEach(day => {
            //@ts-ignore
            attData[(0, date_1.twoDigitDay)(day)] += attd[(0, date_1.twoDigitDay)(day)];
        });
    });
    const finalData = [];
    Object.keys(attData).forEach(key => {
        if (key.includes('day'))
            finalData.push({ day: key.slice(3), attend: attData[key] });
    });
    return finalData;
});
const employeeSheet = (month) => __awaiter(void 0, void 0, void 0, function* () {
    const today = new Date();
    if (!month)
        month = today.getMonth();
    const sheetData = yield model_1.default.find({ month }).populate('user');
    const populatedData = yield Promise.all(sheetData.map((sheet) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const employee = yield model_3.default.findOne({ user: sheet.user._id });
        return Object.assign(Object.assign({}, sheet._doc), { name: (_a = sheet === null || sheet === void 0 ? void 0 : sheet.user) === null || _a === void 0 ? void 0 : _a.name, employeeId: employee === null || employee === void 0 ? void 0 : employee._id });
    })));
    return populatedData;
});
const mySheet = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const myData = yield model_2.default.getRoleSpecificDetails(user.userId);
    if (!myData)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    const today = new Date();
    const month = today.getMonth(), year = today.getFullYear();
    let sheetData = yield model_1.default.findOne({ month, user: myData._id });
    if (!sheetData)
        sheetData = yield model_1.default.create({ year, month, user: myData._id });
    return sheetData;
});
const attdStatus = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const myData = yield model_2.default.getRoleSpecificDetails(user.userId);
    if (!myData)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    const today = new Date();
    const date = today.getDate();
    const mysheetData = yield mySheet(user);
    //@ts-ignore
    return { 'status': mysheetData[(0, date_1.twoDigitDay)(date)] };
});
const confirmAttendance = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const myData = yield model_2.default.getRoleSpecificDetails(user.userId);
    if (!myData)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    const today = new Date();
    const date = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();
    const currDay = { [(0, date_1.twoDigitDay)(date)]: true };
    const sheetData = yield model_1.default.findOneAndUpdate({ month, year, user: myData._id }, currDay, { new: true }).populate('user');
    return sheetData;
});
exports.AttendanceServices = {
    stats,
    employeeSheet,
    mySheet,
    attdStatus,
    confirmAttendance,
};
