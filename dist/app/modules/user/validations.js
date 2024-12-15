"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = require("zod");
const register = zod_1.z.object({
    body: zod_1.z.object({
        companyName: zod_1.z.string({ required_error: 'Company Name is required' }),
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email('Must be an email'),
        phone: zod_1.z.string({ required_error: 'Phone is required' }),
        address: zod_1.z.string(),
    }),
});
exports.UserValidations = {
    register,
};
