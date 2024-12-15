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
exports.TaskServices = void 0;
const model_1 = __importDefault(require("../project/model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const model_2 = __importDefault(require("./model"));
const model_3 = __importDefault(require("../user/model"));
const model_4 = __importDefault(require("../employee/model"));
const user_1 = require("../../../enums/user");
const object_1 = __importDefault(require("../../../utils/object"));
const services_1 = require("../notification/services");
const get = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = user;
    const userDetails = yield model_3.default.getRoleSpecificDetails(userId);
    if (!userDetails)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User data not found!');
    let tasks = yield model_2.default.find({ assignedTo: userDetails === null || userDetails === void 0 ? void 0 : userDetails.employee._id }).populate('project');
    tasks = tasks.map((task) => ({
        id: task._id,
        name: task.name,
        project: task.project,
        projectId: task.project._id,
        projectName: task.project.name,
        status: task.status
    }));
    return tasks;
});
const getByProject = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield model_1.default.findById(projectId);
    if (!project)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Project is not exist!');
    let tasks = yield model_2.default.find({ project: project._id }).populate({
        path: 'assignedTo',
        populate: { path: 'user' },
    });
    tasks = tasks.map((task) => {
        var _a, _b, _c;
        return ({
            name: task.name,
            user: (_a = task === null || task === void 0 ? void 0 : task.assignedTo) === null || _a === void 0 ? void 0 : _a.user,
            assignee: (_c = (_b = task === null || task === void 0 ? void 0 : task.assignedTo) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.name,
            status: task === null || task === void 0 ? void 0 : task.status,
        });
    });
    return tasks;
});
const add = (userId, taskData) => __awaiter(void 0, void 0, void 0, function* () {
    const { project: projectId, assignedTo } = taskData;
    const project = yield model_1.default.findById(projectId);
    if (!project)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Project is not exist!');
    const employee = yield model_4.default.findById(assignedTo);
    if (!employee)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Employee account doesn't not exist!");
    const user = yield model_3.default.getRoleSpecificDetails(userId);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Manager user account not found!');
    // ToDo: Only Particular project manager can assign task
    // if (user?.manager._id != project.manager)
    //   throw new ApiError(httpStatus.BAD_REQUEST, "You're not authorized to update this project")
    yield services_1.NotificationServices.add({
        from: user._id,
        to: employee.user,
        text: "You're assigned a Task.",
    });
    const task = yield model_2.default.create(taskData);
    return task;
});
const update = (user, id, taskData) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield model_2.default.findById(id).populate([
        {
            path: 'project',
            populate: {
                path: 'manager',
                populate: {
                    path: 'employee',
                    populate: {
                        path: 'user',
                    },
                },
            },
        },
        {
            path: 'assignedTo',
            populate: {
                path: 'user',
            },
        },
    ]);
    if (!task)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Task is not exist!');
    const userData = yield model_3.default.getRoleSpecificDetails(user.userId);
    if (!userData)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User account not found!');
    /*
    ToDo: Only assigned manager and employee can update task
    if (userData?.manager._id != task.project.manager)
      throw new ApiError(httpStatus.BAD_REQUEST, "You're not authorized to update this task")
    
    if(user.role == ENUM_USER_ROLE.EMPLOYEE && task.assignedTo != userData.employee._id)
        throw new ApiError(httpStatus.BAD_REQUEST, "You're not authorized to update this task")
    */
    if (user.role === user_1.ENUM_USER_ROLE.MANAGER &&
        (0, object_1.default)(taskData, ['name', 'assignedTo'])) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You only can edit name or assignedTo!');
    }
    if (user.role === user_1.ENUM_USER_ROLE.EMPLOYEE &&
        (0, object_1.default)(taskData, ['status']))
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'You only can edit status!');
    if (user.role === user_1.ENUM_USER_ROLE.EMPLOYEE)
        return updateStatus(userData._id, task, taskData.status);
    yield services_1.NotificationServices.add({
        from: userData._id,
        //@ts-ignore
        to: task.assignedTo.user._id,
        text: `Task ${task.name} is updated`,
    });
    return yield model_2.default.findByIdAndUpdate(id, taskData, { new: true });
});
const updateStatus = (employeeUserId, task, status) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    //@ts-ignore
    const managerUserId = (_d = (_c = (_b = (_a = task === null || task === void 0 ? void 0 : task.project) === null || _a === void 0 ? void 0 : _a.manager) === null || _b === void 0 ? void 0 : _b.employee) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d._id;
    yield services_1.NotificationServices.add({
        from: employeeUserId,
        to: managerUserId,
        text: `Task:${task.name} status has been updated`,
    });
    //@ts-ignore
    yield model_2.default.findByIdAndUpdate(task._id, { status }, { new: true });
});
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const task = yield model_2.default.findById(id);
    if (!task)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Task is not exist!');
    return yield model_2.default.findByIdAndDelete(id);
});
exports.TaskServices = {
    get,
    getByProject,
    add,
    update,
    remove,
};
