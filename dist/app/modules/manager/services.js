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
exports.ManagerServices = void 0;
const manager_1 = require("../../../enums/manager");
const model_1 = __importDefault(require("./model"));
const model_2 = __importDefault(require("../project/model"));
const date_1 = require("../../../utils/date");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const model_3 = __importDefault(require("../user/model"));
const model_4 = __importDefault(require("../department/model"));
const get = () => __awaiter(void 0, void 0, void 0, function* () {
    const managers = yield model_1.default.find({
        status: manager_1.ENUM_MANAGER_STATUS.ACTIVE,
    }).populate([
        {
            path: 'employee',
            populate: { path: 'user' },
        },
        {
            path: 'employee',
            populate: { path: 'department' },
        },
    ]);
    const resData = [];
    //@ts-ignore
    managers.forEach(manager => resData.push({
        _id: manager._id,
        name: manager.employee.user.name,
        phone: manager.employee.user.phone,
        email: manager.employee.user.email,
        employeeId: manager.employee._id,
        department: manager.employee.department.name,
        departmentId: manager.employee.department._id,
        designation: manager.employee.designation,
        user: manager.employee.user,
    }));
    return resData;
});
const getDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
    const manager = yield model_1.default.findById(id).populate([
        {
            path: 'employee',
            populate: { path: 'user' },
        },
        {
            path: 'employee',
            populate: { path: 'department' },
        },
    ]);
    if (!manager)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'No manager found');
    const resData = {
        name: (_b = (_a = manager === null || manager === void 0 ? void 0 : manager.employee) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.name,
        email: (_d = (_c = manager === null || manager === void 0 ? void 0 : manager.employee) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.email,
        department: (_f = (_e = manager === null || manager === void 0 ? void 0 : manager.employee) === null || _e === void 0 ? void 0 : _e.department) === null || _f === void 0 ? void 0 : _f.name,
        departmentId: (_h = (_g = manager === null || manager === void 0 ? void 0 : manager.employee) === null || _g === void 0 ? void 0 : _g.department) === null || _h === void 0 ? void 0 : _h._id,
        employeeId: (_j = manager === null || manager === void 0 ? void 0 : manager.employee) === null || _j === void 0 ? void 0 : _j._id,
        designation: manager === null || manager === void 0 ? void 0 : manager.employee.designation,
        phone: (_l = (_k = manager === null || manager === void 0 ? void 0 : manager.employee) === null || _k === void 0 ? void 0 : _k.user) === null || _l === void 0 ? void 0 : _l.phone,
        address: ((_o = (_m = manager === null || manager === void 0 ? void 0 : manager.employee) === null || _m === void 0 ? void 0 : _m.user) === null || _o === void 0 ? void 0 : _o.address) || 'No Address',
        joinedAt: (0, date_1.formatDate)((_q = (_p = manager === null || manager === void 0 ? void 0 : manager.employee) === null || _p === void 0 ? void 0 : _p.user) === null || _q === void 0 ? void 0 : _q.createdAt),
    };
    //@ts-ignore
    resData['projects'] = yield model_2.default.find({ manager: manager._id });
    return resData;
});
const getSelectOptions = () => __awaiter(void 0, void 0, void 0, function* () {
    const managers = yield model_1.default.find().populate({
        path: 'employee',
        populate: { path: 'user' },
    });
    const optionsData = [];
    managers.forEach(manager => 
    //@ts-ignore
    optionsData.push({ label: manager.employee.user.name, value: manager._id }));
    return managers;
});
const getMyManager = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    const userData = yield model_3.default.getRoleSpecificDetails(user.userId);
    if (!userData)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'No user found!');
    const dept = yield model_4.default.findById((_s = (_r = userData === null || userData === void 0 ? void 0 : userData.employee) === null || _r === void 0 ? void 0 : _r.department) === null || _s === void 0 ? void 0 : _s._id).populate({
        path: 'manager',
        populate: { path: 'employee', populate: 'user' },
    });
    const manager = {
        name: (_v = (_u = (_t = dept === null || dept === void 0 ? void 0 : dept.manager) === null || _t === void 0 ? void 0 : _t.employee) === null || _u === void 0 ? void 0 : _u.user) === null || _v === void 0 ? void 0 : _v.name,
        user: (_x = (_w = dept === null || dept === void 0 ? void 0 : dept.manager) === null || _w === void 0 ? void 0 : _w.employee) === null || _x === void 0 ? void 0 : _x.user,
        email: (_0 = (_z = (_y = dept === null || dept === void 0 ? void 0 : dept.manager) === null || _y === void 0 ? void 0 : _y.employee) === null || _z === void 0 ? void 0 : _z.user) === null || _0 === void 0 ? void 0 : _0.email,
        phone: (_3 = (_2 = (_1 = dept === null || dept === void 0 ? void 0 : dept.manager) === null || _1 === void 0 ? void 0 : _1.employee) === null || _2 === void 0 ? void 0 : _2.user) === null || _3 === void 0 ? void 0 : _3.phone,
        department: dept === null || dept === void 0 ? void 0 : dept.name,
    };
    return manager;
});
exports.ManagerServices = {
    get,
    getDetails,
    getSelectOptions,
    getMyManager,
};
