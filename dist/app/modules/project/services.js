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
exports.ProjectServices = void 0;
const model_1 = __importDefault(require("./model"));
const user_1 = require("../../../enums/user");
const model_2 = __importDefault(require("../user/model"));
const model_3 = __importDefault(require("../manager/model"));
const manager_1 = require("../../../enums/manager");
const model_4 = __importDefault(require("../department/model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const project_1 = require("../../../enums/project");
const object_1 = __importDefault(require("../../../utils/object"));
const model_5 = __importDefault(require("../task/model"));
const model_6 = __importDefault(require("../employee/model"));
const services_1 = require("../notification/services");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const constants_1 = require("./constants");
const date_1 = require("../../../utils/date");
const get = (user, pagination, filters) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { userId, role } = user;
    const andConditions = [];
    if (role == user_1.ENUM_USER_ROLE.MANAGER) {
        const query = {};
        query['manager'] = (_b = (_a = (yield model_2.default.getRoleSpecificDetails(userId))) === null || _a === void 0 ? void 0 : _a.manager) === null || _b === void 0 ? void 0 : _b._id;
        andConditions.push(query);
    }
    const { page, limit, skip, sortOrder, sortBy } = paginationHelper_1.paginationHelpers.calculatePagination(pagination);
    if (role == user_1.ENUM_USER_ROLE.MANAGER) {
        const query = {};
        query['department'] = (_d = (_c = (yield model_2.default.getRoleSpecificDetails(userId))) === null || _c === void 0 ? void 0 : _c.employee) === null || _d === void 0 ? void 0 : _d.department;
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
                [field]: { '$regex': searchTerm, '$options': 'i' },
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
    let projects = yield model_1.default.find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit)
        .populate([
        {
            path: 'department',
            populate: {
                path: 'manager',
                populate: { path: 'employee', populate: 'user' },
            },
        },
    ])
        .lean();
    projects = projects.map((project) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return ({
            id: project._id,
            projectName: project.name,
            department: (_a = project === null || project === void 0 ? void 0 : project.department) === null || _a === void 0 ? void 0 : _a.name,
            manager: (_e = (_d = (_c = (_b = project === null || project === void 0 ? void 0 : project.department) === null || _b === void 0 ? void 0 : _b.manager) === null || _c === void 0 ? void 0 : _c.employee) === null || _d === void 0 ? void 0 : _d.user) === null || _e === void 0 ? void 0 : _e.name,
            managerId: (_g = (_f = project === null || project === void 0 ? void 0 : project.department) === null || _f === void 0 ? void 0 : _f.manager) === null || _g === void 0 ? void 0 : _g._id,
            employeeId: (_k = (_j = (_h = project === null || project === void 0 ? void 0 : project.department) === null || _h === void 0 ? void 0 : _h.manager) === null || _j === void 0 ? void 0 : _j.employee) === null || _k === void 0 ? void 0 : _k._id,
            issueDate: (0, date_1.formatDate)(project === null || project === void 0 ? void 0 : project.issueDate),
            expectedEndDate: (0, date_1.formatDate)(project === null || project === void 0 ? void 0 : project.expectedEndDate),
            plainExpectedEndDate: project === null || project === void 0 ? void 0 : project.expectedEndDate,
            status: project === null || project === void 0 ? void 0 : project.status,
        });
    });
    const total = yield model_1.default.countDocuments(whereCondition);
    const totalPages = Math.ceil(total / limit);
    const meta = { total, page, limit, totalPages };
    return { meta, data: projects };
});
const getDetails = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield model_1.default.findById(id).populate([{
            path: 'manager',
            populate: {
                path: 'employee',
                populate: {
                    path: 'user',
                },
            },
        }, { path: 'department' }]).lean();
    if (!project)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'No project account found');
    const resData = {
        name: project.name,
        issueDate: (0, date_1.formatDate)(project.issueDate),
        expectedEndDate: (0, date_1.formatDate)(project.expectedEndDate),
        plainExpectedEndDate: project === null || project === void 0 ? void 0 : project.expectedEndDate,
        department: project.department,
        manager: project.manager.employee.user,
        status: project.status,
        duration: (0, date_1.calculateDateDifference)(project.issueDate, project.expectedEndDate),
    };
    //@ts-ignore
    resData['tasks'] = yield model_5.default.find({ project: project._id }).populate({ path: 'assignedTo', populate: { path: 'user' } });
    return resData;
});
const getSelectOptions = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = user;
    const userData = yield model_2.default.getRoleSpecificDetails(userId);
    if (!userData)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist!");
    const manager = yield model_3.default.find({
        employee: userData.employee._id,
        status: manager_1.ENUM_MANAGER_STATUS.ACTIVE,
    });
    //@ts-ignore
    let projects = yield model_1.default.find({ manager: manager._id });
    projects = projects.map((projct) => ({
        label: projct.name,
        value: projct._id,
    }));
    return projects;
});
const add = (userId, projectData) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield model_2.default.findOne({ userId });
    if (!admin)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Admin account not found');
    const { department } = projectData;
    const dept = yield model_4.default.findById(department);
    if (!dept)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Department doesn't exist!");
    if (!dept.manager)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Manager is not assigned to ${dept.name} department!`);
    const from = admin._id;
    const text = `Project ${projectData.name} has been initialized under your department.`;
    const employees = yield model_6.default.find({ department: department }).populate('user');
    Promise.all(employees.map((emp) => __awaiter(void 0, void 0, void 0, function* () { return yield services_1.NotificationServices.add({ from, to: emp.user._id, text }); })));
    projectData.manager = dept.manager;
    projectData.status = project_1.ENUM_PROJECT_STATUS.TO_DO;
    const project = yield model_1.default.create(projectData);
    return project;
});
const update = (user, id, projectData) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, role } = user;
    const userData = yield model_2.default.findOne({ userId });
    if (!userData)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User account not found');
    const projectExist = yield model_1.default.findById(id);
    if (!projectExist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Project Doesn't Exist!");
    const isManager = role === user_1.ENUM_USER_ROLE.MANAGER;
    const isAdmin = role === user_1.ENUM_USER_ROLE.ADMIN;
    if (isAdmin && (0, object_1.default)(projectData, ['name', 'expectedEndDate']))
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You only can edit name / end date');
    if (isManager && (0, object_1.default)(projectData, ['status']))
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You only can edit status');
    // Notification Sending -> start
    const from = userData._id;
    const adminText = `Project '${projectExist.name}' details has been updated`;
    const managerText = `Project '${projectExist.name}' status has been updated`;
    const employees = yield model_6.default.find({
        department: projectExist.department,
    }).populate('user');
    const admins = yield model_2.default.find({ role: user_1.ENUM_USER_ROLE.ADMIN });
    if (isAdmin)
        Promise.all(employees.map((emp) => __awaiter(void 0, void 0, void 0, function* () {
            return yield services_1.NotificationServices.add({
                from,
                to: emp.user._id,
                text: adminText,
            });
        })));
    const userIds = [];
    employees.forEach(emp => userIds.push(emp.user._id));
    admins.forEach(admin => userIds.push(admin._id));
    //@ts-ignore
    if (isManager)
        Promise.all(userIds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            return yield services_1.NotificationServices.add({
                from,
                to: id,
                text: managerText,
            });
        })));
    // Notification Sending -> end
    const project = yield model_1.default.findByIdAndUpdate(id, projectData, {
        new: true,
    });
    return project;
});
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const projectExist = yield model_1.default.findById(id);
    if (!projectExist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Project Doesn't Exist!");
    yield model_5.default.deleteMany({ project: projectExist._id });
    const project = yield model_1.default.findByIdAndDelete(id);
    return project;
});
exports.ProjectServices = {
    get,
    getDetails,
    getSelectOptions,
    add,
    update,
    remove,
};
