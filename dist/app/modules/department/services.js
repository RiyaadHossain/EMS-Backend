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
exports.DepartmentServices = void 0;
const manager_1 = require("../../../enums/manager");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const model_1 = __importDefault(require("../employee/model"));
const model_2 = __importDefault(require("../manager/model"));
const model_3 = __importDefault(require("./model"));
const designation_1 = require("../../../enums/designation");
const model_4 = __importDefault(require("../user/model"));
const user_1 = require("../../../enums/user");
const model_5 = __importDefault(require("../project/model"));
const get = () => __awaiter(void 0, void 0, void 0, function* () {
    const departments = yield model_3.default.find().populate({
        path: 'manager',
        populate: {
            path: 'employee',
            populate: 'user',
        },
    });
    const populatedDepts = yield Promise.all(departments.map((dept) => __awaiter(void 0, void 0, void 0, function* () {
        const totalEmployee = yield model_1.default.find({
            department: dept._id,
        }).countDocuments();
        //@ts-ignore
        return Object.assign(Object.assign({}, dept._doc), { totalEmployee });
    })));
    const resData = [];
    populatedDepts.forEach((dept) => {
        var _a, _b, _c, _d, _e, _f;
        return resData.push({
            id: dept._id,
            departmentName: dept.name,
            manager: ((_c = (_b = (_a = dept.manager) === null || _a === void 0 ? void 0 : _a.employee) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.name) || "No Manager",
            managerId: ((_d = dept.manager) === null || _d === void 0 ? void 0 : _d._id) || null,
            employeeId: ((_f = (_e = dept.manager) === null || _e === void 0 ? void 0 : _e.employee) === null || _f === void 0 ? void 0 : _f._id) || null,
            totalEmployee: dept.totalEmployee,
        });
    });
    return resData;
});
const getDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const department = yield model_3.default.findById(id).populate({
        path: 'manager',
        populate: {
            path: 'employee',
            populate: 'user',
        },
    }).lean();
    if (!department)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "No Department found!");
    department['projects'] = yield model_5.default.find({ department: department._id });
    department['totalEmployee'] = yield model_1.default.find({ department: department._id }).countDocuments();
    return department;
});
const getSelectOptions = () => __awaiter(void 0, void 0, void 0, function* () {
    const selectOptins = [];
    const departments = yield model_3.default.find();
    departments.forEach(dept => selectOptins.push({ label: dept.name, value: dept._id }));
    return selectOptins;
});
const add = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const deptPayload = { name: payload.name };
    const department = yield model_3.default.create(deptPayload);
    return department;
});
const update = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { employee } = payload;
    const dept = yield model_3.default.findById(id);
    if (!dept)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "The department doesn't exist!");
    if (payload === null || payload === void 0 ? void 0 : payload.employee) {
        const employeeData = yield model_1.default.findById(payload.employee);
        if (!employeeData)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "The employee doesn't exist!");
        const manager = yield model_2.default.findOne({ employee, status: manager_1.ENUM_MANAGER_STATUS.ACTIVE });
        if (manager)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'The employee already is a manager!');
        const prevManager = yield model_2.default.findByIdAndUpdate(dept.manager, {
            status: manager_1.ENUM_MANAGER_STATUS.IN_ACTIVE,
        }).populate('employee');
        //@ts-ignore
        yield model_4.default.findByIdAndUpdate((_a = prevManager === null || prevManager === void 0 ? void 0 : prevManager.employee) === null || _a === void 0 ? void 0 : _a.user, {
            role: user_1.ENUM_USER_ROLE.EMPLOYEE,
        });
        yield model_1.default.findByIdAndUpdate((_b = prevManager === null || prevManager === void 0 ? void 0 : prevManager.employee) === null || _b === void 0 ? void 0 : _b._id, {
            designation: designation_1.ENUM_DESIGNATION.MEMBER,
        });
        yield model_1.default.findByIdAndUpdate(employee, {
            department: dept._id,
            designation: designation_1.ENUM_DESIGNATION.MANAGER,
        });
        yield model_4.default.findByIdAndUpdate(employeeData.user, {
            role: user_1.ENUM_USER_ROLE.MANAGER,
        });
        const newManager = yield model_2.default.create({ employee });
        payload.manager = newManager._id;
    }
    return yield model_3.default.findByIdAndUpdate(id, payload, { new: true });
});
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const dept = yield model_3.default.findById(id);
    if (!dept)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "The department doesn't exist!");
    const prevManager = yield model_2.default.findByIdAndUpdate(dept.manager, {
        status: manager_1.ENUM_MANAGER_STATUS.IN_ACTIVE,
    }).populate('employee');
    //@ts-ignore
    yield model_4.default.findByIdAndUpdate((_c = prevManager === null || prevManager === void 0 ? void 0 : prevManager.employee) === null || _c === void 0 ? void 0 : _c.user, {
        role: user_1.ENUM_USER_ROLE.EMPLOYEE,
    });
    const employees = yield model_1.default.find({ department: id });
    yield Promise.all(employees.map((emp) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield model_1.default.findByIdAndUpdate(emp._id, {
            department: null,
            designation: designation_1.ENUM_DESIGNATION.MEMBER,
        });
        return result;
    })));
    return yield model_3.default.findByIdAndDelete(id);
});
exports.DepartmentServices = {
    get,
    getDetails,
    getSelectOptions,
    add,
    update,
    remove,
};
