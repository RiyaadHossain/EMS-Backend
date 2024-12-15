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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeServices = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const model_1 = __importDefault(require("../user/model"));
const model_2 = __importDefault(require("./model"));
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("../user/utils");
const user_1 = require("../../../enums/user");
const utils_2 = require("./utils");
const designation_1 = require("../../../enums/designation");
const model_3 = __importDefault(require("../department/model"));
const model_4 = __importDefault(require("../manager/model"));
const manager_1 = require("../../../enums/manager");
const services_1 = require("../notification/services");
const model_5 = __importDefault(require("../project/model"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const constants_1 = require("./constants");
const date_1 = require("../../../utils/date");
const add = (adminId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield model_1.default.findOne({ userId: adminId });
    if (!admin)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Admin account not found');
    const { designation, department } = payload;
    const isExist = yield model_2.default.isEmployeeExist(payload.email);
    if (isExist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Employee with the same email already exist!');
    const dept = yield model_3.default.findById(department);
    if (!dept)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Department doesn' exist!");
    if (designation == designation_1.ENUM_DESIGNATION.MANAGER && (dept === null || dept === void 0 ? void 0 : dept.manager))
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'This Department already has a manager');
    //  Generate userId and hash password
    const userId = yield utils_1.UserUtils.generateId(user_1.ENUM_USER_ROLE.EMPLOYEE);
    const password = utils_1.UserUtils.generatePassword();
    // console.log({userId, password});
    const { name, email, phone, address } = payload;
    const role = designation == designation_1.ENUM_DESIGNATION.MANAGER
        ? user_1.ENUM_USER_ROLE.MANAGER
        : user_1.ENUM_USER_ROLE.EMPLOYEE;
    const userPaylod = {
        name,
        userId,
        email,
        phone,
        address,
        password,
        role,
    };
    const user = yield model_1.default.create(userPaylod);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user account');
    const employeePayload = {
        user: user._id,
        department: department,
        designation: designation,
    };
    const employee = yield model_2.default.create(employeePayload);
    if (designation === designation_1.ENUM_DESIGNATION.MANAGER) {
        const manager = yield model_4.default.create({
            employee: employee._id,
            status: manager_1.ENUM_MANAGER_STATUS.ACTIVE,
        });
        dept.manager = manager._id;
        yield dept.save();
    }
    yield services_1.NotificationServices.add({
        from: admin._id,
        to: user._id,
        text: "Welcome, You're onboarded.",
    });
    // Send Confirmation Email to User
    yield utils_2.EmployeeUtils.onboardEmloyeeEmail({ email, userId, password });
});
const get = ({ user, pagination, filters }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { role, userId } = user;
    const { page, limit, skip, sortOrder, sortBy } = paginationHelper_1.paginationHelpers.calculatePagination(pagination);
    const andConditions = [];
    if (role == user_1.ENUM_USER_ROLE.MANAGER) {
        const query = {};
        query['department'] = (_b = (_a = (yield model_1.default.getRoleSpecificDetails(userId))) === null || _a === void 0 ? void 0 : _a.employee) === null || _b === void 0 ? void 0 : _b.department;
        andConditions.push(query);
    }
    // Sort condition
    const sortCondition = {};
    sortCondition[sortBy] = sortOrder;
    // Filter Options
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    if (searchTerm) {
        andConditions.push({
            $or: constants_1.searchableFields.map(field => ({
                [field]: { $regex: searchTerm, $options: 'i' },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    const whereCondition = andConditions.length ? { $and: andConditions } : {};
    let employees = yield model_2.default.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit)
        .populate([
        { path: 'user' },
        {
            path: 'department',
            populate: {
                path: 'manager',
                populate: { path: 'employee', populate: { path: 'user' } },
            },
        },
    ])
        .lean();
    employees = employees.map((emp) => {
        var _a;
        return ({
            id: emp._id,
            name: emp.user.name,
            email: emp.user.email,
            phone: emp.user.phone,
            department: ((_a = emp === null || emp === void 0 ? void 0 : emp.department) === null || _a === void 0 ? void 0 : _a.name) || 'No Department',
            designation: (emp === null || emp === void 0 ? void 0 : emp.designation) || 'No Designation',
        });
    });
    const total = yield model_2.default.countDocuments(whereCondition);
    const totalPages = Math.ceil(total / limit);
    const meta = { total, page, limit, totalPages };
    return { meta, data: employees };
});
const getDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f, _g, _h;
    const employee = yield model_2.default.findById(id).populate('user').lean();
    if (!employee)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'No employee account found');
    const resData = {
        name: (_c = employee === null || employee === void 0 ? void 0 : employee.user) === null || _c === void 0 ? void 0 : _c.name,
        email: (_d = employee === null || employee === void 0 ? void 0 : employee.user) === null || _d === void 0 ? void 0 : _d.email,
        department: (_e = employee === null || employee === void 0 ? void 0 : employee.department) === null || _e === void 0 ? void 0 : _e.name,
        designation: employee === null || employee === void 0 ? void 0 : employee.designation,
        phone: (_f = employee === null || employee === void 0 ? void 0 : employee.user) === null || _f === void 0 ? void 0 : _f.phone,
        address: ((_g = employee === null || employee === void 0 ? void 0 : employee.user) === null || _g === void 0 ? void 0 : _g.address) || 'No Address',
        joinedAt: (0, date_1.formatDate)((_h = employee === null || employee === void 0 ? void 0 : employee.user) === null || _h === void 0 ? void 0 : _h.createdAt),
    };
    if (employee.designation == designation_1.ENUM_DESIGNATION.MANAGER) {
        const managerIds = [];
        const managerDocs = yield model_4.default.find({ employee: employee._id });
        managerDocs.forEach(manager => managerIds.push(manager._id));
        resData['projects'] = yield model_5.default.find({
            manager: { $in: managerIds },
        });
    }
    return resData;
});
const getSelectOptions = (user, department) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = user;
    const selectOptins = [];
    const userData = yield model_1.default.getRoleSpecificDetails(userId);
    if (!userData)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "No user found!");
    const query = { department };
    if (role == user_1.ENUM_USER_ROLE.MANAGER) {
        query['department'] = userData.employee.department;
    }
    const employees = yield model_2.default.find(query).populate('user');
    employees.forEach((employee) => {
        var _a;
        if (!(employee === null || employee === void 0 ? void 0 : employee._id.equals((_a = userData === null || userData === void 0 ? void 0 : userData.employee) === null || _a === void 0 ? void 0 : _a._id)))
            selectOptins.push({ label: employee.user.name, value: employee._id });
    });
    return selectOptins;
});
const update = (userId, id, empData) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield model_1.default.findOne({ userId });
    if (!admin)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Admin account not found');
    const emp = yield model_2.default.findById(id);
    if (!emp)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Employee doesn't exist!");
    let dept = null;
    if (empData === null || empData === void 0 ? void 0 : empData.department) {
        dept = yield model_3.default.findById(empData.department);
        if (!dept)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Department doesn't exist!");
    }
    const user = yield model_1.default.findById(emp.user);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist!");
    if ((empData === null || empData === void 0 ? void 0 : empData.designation) === designation_1.ENUM_DESIGNATION.MANAGER) {
        if (!dept && !emp.department)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Please Select a Department!');
        if (!dept)
            dept = yield model_3.default.findById(emp.department);
        if (!dept)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Department not found!');
        if (dept === null || dept === void 0 ? void 0 : dept.manager)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Department has already a manager!');
        const manager = yield model_4.default.create({
            employee: emp._id,
            status: manager_1.ENUM_MANAGER_STATUS.ACTIVE,
        });
        dept.manager = manager._id;
        yield dept.save();
        user.role = user_1.ENUM_USER_ROLE.MANAGER;
        yield user.save();
    }
    if ((empData === null || empData === void 0 ? void 0 : empData.designation) != designation_1.ENUM_DESIGNATION.MANAGER) {
        emp.designation = empData.designation;
        user.role = user_1.ENUM_USER_ROLE.EMPLOYEE;
        yield emp.save();
        yield user.save();
        yield model_3.default.findByIdAndUpdate(emp.department, { manager: null });
        yield model_4.default.updateMany({ employee: emp._id }, { status: manager_1.ENUM_MANAGER_STATUS.IN_ACTIVE });
    }
    yield services_1.NotificationServices.add({
        from: admin._id,
        to: user._id,
        text: `Again log in! Admin has changed your information.`,
    });
    return yield model_2.default.findByIdAndUpdate(id, empData, { new: true });
});
exports.EmployeeServices = {
    add,
    getSelectOptions,
    get,
    getDetails,
    update,
};
