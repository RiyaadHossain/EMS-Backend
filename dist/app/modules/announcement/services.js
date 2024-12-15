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
exports.AnnouncementServices = void 0;
const model_1 = __importDefault(require("./model"));
const model_2 = __importDefault(require("../user/model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const user_1 = require("../../../enums/user");
const model_3 = __importDefault(require("../employee/model"));
const model_4 = __importDefault(require("../notification/model"));
const model_5 = __importDefault(require("../department/model"));
const model_6 = __importDefault(require("../manager/model"));
const date_1 = require("../../../utils/date");
const get = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { userId, role } = user;
    const userDetails = yield model_2.default.getRoleSpecificDetails(userId);
    if (!userDetails)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Uesr account not found!');
    let announcements = [];
    const announcers = [];
    const admins = yield model_2.default.find({ role: user_1.ENUM_USER_ROLE.ADMIN });
    admins.forEach(admin => announcers.push(admin._id));
    if (role == user_1.ENUM_USER_ROLE.MANAGER || role == user_1.ENUM_USER_ROLE.EMPLOYEE)
        announcers.push(userDetails._id);
    if (role == user_1.ENUM_USER_ROLE.EMPLOYEE) {
        const manager = (_a = (yield model_5.default.findById(userDetails.employee.department))) === null || _a === void 0 ? void 0 : _a.manager;
        if (!manager)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Manager couldn't find!");
        const managerDetails = yield model_6.default.findById(manager._id).populate({
            path: 'employee',
            populate: { path: 'user' },
        });
        //@ts-ignore
        const managerUserId = (_c = (_b = managerDetails === null || managerDetails === void 0 ? void 0 : managerDetails.employee) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c._id;
        announcers.push(managerUserId);
    }
    announcements = yield model_1.default.find({ announcedBy: { $in: announcers } }).populate('announcedBy');
    announcements = announcements.map((announcement) => {
        var _a;
        return ({
            id: announcement._id,
            username: (_a = announcement === null || announcement === void 0 ? void 0 : announcement.announcedBy) === null || _a === void 0 ? void 0 : _a.name,
            announcement: announcement.text,
            time: (0, date_1.timeAgo)(announcement.createdAt),
        });
    });
    return announcements;
});
const add = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = user;
    const userDetails = yield model_2.default.getRoleSpecificDetails(userId);
    if (!userDetails)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Uesr account not found!');
    const from = userDetails._id;
    const text = `Alert! There is an announcement from ${role}`;
    if (role === user_1.ENUM_USER_ROLE.ADMIN) {
        const employees = yield model_3.default.find().populate('user');
        Promise.all(employees.map((emp) => __awaiter(void 0, void 0, void 0, function* () { return yield model_4.default.create({ from, to: emp.user._id, text }); })));
    }
    if (role === user_1.ENUM_USER_ROLE.MANAGER) {
        const allEmployees = yield model_3.default.find({
            department: userDetails.employee.department,
        }).populate('user');
        const selectedEmployees = [];
        allEmployees.forEach(emp => {
            if (emp.user._id != userDetails._id)
                selectedEmployees.push(emp);
        });
        Promise.all(selectedEmployees.map((emp) => __awaiter(void 0, void 0, void 0, function* () { return yield model_4.default.create({ from, to: emp.user._id, text }); })));
    }
    payload.announcedBy = userDetails._id;
    const announcements = yield model_1.default.create(payload);
    return announcements;
});
exports.AnnouncementServices = {
    get,
    add,
};
