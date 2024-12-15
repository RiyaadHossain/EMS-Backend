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
exports.UserUtils = void 0;
const user_1 = require("../../../enums/user");
const model_1 = __importDefault(require("./model"));
const emailSender_1 = require("../../../helpers/emailSender");
const getLastUserId = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield model_1.default.findOne().sort({ createdAt: -1 });
    return user === null || user === void 0 ? void 0 : user.userId.substr(2);
});
const generateId = (role) => __awaiter(void 0, void 0, void 0, function* () {
    let prefix = 'A';
    if (role !== user_1.ENUM_USER_ROLE.ADMIN)
        prefix = 'E';
    const lastUserId = (yield getLastUserId()) || String(0).padStart(5, '0');
    let generatedId = (parseInt(lastUserId) + 1).toString().padStart(5, '0');
    generatedId = `${prefix}-${generatedId}`;
    return generatedId;
});
const generatePassword = (length = 20) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};
const sendRegistrationEmail = (emailPayload) => __awaiter(void 0, void 0, void 0, function* () {
    const emailContent = `
        <h1>Welcom to EMS</h1>
        <p>User Id: ${emailPayload.userId}</p>
        <p>Password: ${emailPayload.password}</p>
        <span>Don't share your credentials with others.</span>
    `;
    const mailInfo = {
        to: emailPayload.email,
        subject: 'Admin Credendianl',
        html: emailContent,
    };
    yield (0, emailSender_1.emailSender)(mailInfo);
});
exports.UserUtils = {
    generateId,
    generatePassword,
    sendRegistrationEmail
};
