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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeUtils = void 0;
const emailSender_1 = require("../../../helpers/emailSender");
const onboardEmloyeeEmail = ({ email, userId, password }) => __awaiter(void 0, void 0, void 0, function* () {
    const emailContent = `
  <h1>Welcom to EMS</h1>
  <p>User Id: ${userId}</p>
  <p>Password: ${password}</p>
  <span>Don't share your credentials with others.</span>
`;
    const mailInfo = {
        to: email,
        subject: 'Employee Credentials',
        html: emailContent,
    };
    yield (0, emailSender_1.emailSender)(mailInfo);
});
exports.EmployeeUtils = { onboardEmloyeeEmail };
