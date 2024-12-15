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
exports.AuthServices = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const model_1 = __importDefault(require("../user/model"));
const user_1 = require("../../../enums/user");
const model_2 = __importDefault(require("../company/model"));
const company_1 = require("../../../enums/company");
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, password } = payload;
    // Check User Existence
    const userExist = yield model_1.default.findOne({ userId }).select('+password');
    if (!userExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exist!");
    }
    // Check Password
    const isPassMatched = yield model_1.default.isPasswordMatched(password, userExist.password);
    if (!isPassMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password is incorrect!');
    }
    const { role, _id } = userExist;
    if (role == user_1.ENUM_USER_ROLE.ADMIN) {
        yield model_2.default.findOneAndUpdate({ admin: _id }, { status: company_1.ENUM_COMPANY_STATUS.ACTIVE });
    }
    // Generate Tokens
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({ userId, role }, config_1.default.JWT.SECRET, config_1.default.JWT.SECRET_EXPIRE);
    const refreshToken = jwtHelpers_1.jwtHelpers.generateToken({ userId, role }, config_1.default.JWT.REFRESH, config_1.default.JWT.REFRESH_EXPIRE);
    return { accessToken, refreshToken };
});
exports.AuthServices = {
    login
};
