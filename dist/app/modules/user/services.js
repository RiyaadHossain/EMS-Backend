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
exports.UserServices = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const model_1 = __importDefault(require("../company/model"));
const http_status_1 = __importDefault(require("http-status"));
const utils_1 = require("./utils");
const user_1 = require("../../../enums/user");
const model_2 = __importDefault(require("./model"));
const company_1 = require("../../../enums/company");
const register = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Is user exist
    const isExist = yield model_1.default.findOne({
        status: company_1.ENUM_COMPANY_STATUS.ACTIVE,
        email: payload.email,
    });
    if (isExist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Company account is already exist');
    yield model_1.default.deleteMany({ email: payload.email });
    yield model_2.default.deleteMany({ email: payload.email });
    // 3. Generate userId and hash password
    const userId = yield utils_1.UserUtils.generateId(user_1.ENUM_USER_ROLE.ADMIN);
    const password = utils_1.UserUtils.generatePassword();
    const { email, phone, address } = payload;
    const userPaylod = {
        userId,
        email,
        phone,
        address,
        password,
        role: user_1.ENUM_USER_ROLE.ADMIN,
    };
    const user = yield model_2.default.create(userPaylod);
    if (!user)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user account');
    payload.admin = user._id;
    yield model_1.default.create(payload);
    // 4. Send Confirmation Email to User
    yield utils_1.UserUtils.sendRegistrationEmail({ email, userId, password });
});
exports.UserServices = {
    register,
};
