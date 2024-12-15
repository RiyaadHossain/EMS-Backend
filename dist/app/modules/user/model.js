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
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = require("mongoose");
const user_1 = require("../../../enums/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const model_1 = __importDefault(require("../employee/model"));
const model_2 = __importDefault(require("../manager/model"));
const manager_1 = require("../../../enums/manager");
const userSchema = new mongoose_1.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: Object.values(user_1.ENUM_USER_ROLE),
    },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    address: { type: String },
    passwordChanged: { type: Boolean, default: false },
}, { timestamps: true });
// To Hash password
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return next();
        }
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.BCRYPT_SALT_ROUNDS));
        next();
    });
});
// To check User Password
userSchema.statics.isPasswordMatched = function (givenPass, savedPass) {
    return __awaiter(this, void 0, void 0, function* () {
        const isPassMatched = yield bcrypt_1.default.compare(givenPass, savedPass);
        return isPassMatched;
    });
};
userSchema.statics.isUserExist = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExist = yield User.findById(id);
        return isExist;
    });
};
userSchema.statics.getRoleSpecificDetails = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield User.findOne({ userId: id });
        const details = {};
        if ((user === null || user === void 0 ? void 0 : user.role) != user_1.ENUM_USER_ROLE.ADMIN) {
            const employee = yield model_1.default.findOne({ user: user === null || user === void 0 ? void 0 : user._id }).populate('department');
            details['employee'] = employee;
            if ((user === null || user === void 0 ? void 0 : user.role) == user_1.ENUM_USER_ROLE.MANAGER) {
                const manager = yield model_2.default.findOne({
                    employee: employee === null || employee === void 0 ? void 0 : employee._id,
                    status: manager_1.ENUM_MANAGER_STATUS.ACTIVE,
                });
                details['manager'] = manager;
            }
        }
        //@ts-ignore
        return Object.assign(Object.assign({}, user._doc), details);
    });
};
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
