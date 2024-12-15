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
exports.ProfileServices = void 0;
const model_1 = __importDefault(require("../user/model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const date_1 = require("../../../utils/date");
const user_1 = require("../../../enums/user");
const model_2 = __importDefault(require("../manager/model"));
const model_3 = __importDefault(require("../project/model"));
const me = (user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let userData = yield model_1.default.getRoleSpecificDetails(user.userId);
    userData = {
        name: (userData === null || userData === void 0 ? void 0 : userData.name) || (userData === null || userData === void 0 ? void 0 : userData.email),
        email: userData === null || userData === void 0 ? void 0 : userData.email,
        phone: userData === null || userData === void 0 ? void 0 : userData.phone,
        employee: userData === null || userData === void 0 ? void 0 : userData.employee,
        role: userData === null || userData === void 0 ? void 0 : userData.role,
        department: (_b = (_a = userData === null || userData === void 0 ? void 0 : userData.employee) === null || _a === void 0 ? void 0 : _a.department) === null || _b === void 0 ? void 0 : _b.name,
        address: userData === null || userData === void 0 ? void 0 : userData.address,
        joinedAt: (0, date_1.formatDate)(userData === null || userData === void 0 ? void 0 : userData.createdAt)
    };
    if (userData.role == user_1.ENUM_USER_ROLE.MANAGER) {
        const managerIds = [];
        const managerDocs = yield model_2.default.find({ employee: (_c = userData === null || userData === void 0 ? void 0 : userData.employee) === null || _c === void 0 ? void 0 : _c._id });
        managerDocs.forEach(manager => managerIds.push(manager._id));
        userData['projects'] = yield model_3.default.find({
            manager: { '$in': managerIds },
        });
    }
    return userData;
});
const update = (user, data) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield model_1.default.getRoleSpecificDetails(user.userId);
    if (!userData)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'No User found!');
    const updatedData = yield model_1.default.findByIdAndUpdate(userData._id, data, {
        new: true,
    });
    return updatedData;
});
exports.ProfileServices = { me, update };
