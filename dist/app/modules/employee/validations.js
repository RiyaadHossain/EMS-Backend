"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeValidations = void 0;
const zod_1 = require("zod");
const add = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
        email: zod_1.z
            .string({ required_error: 'Email is required' })
            .email('Must be an email'),
        phone: zod_1.z.string({ required_error: 'Phone is required' }),
        designation: zod_1.z.string({ required_error: 'Designation is required' }),
        department: zod_1.z.string({ required_error: 'Designation is required' })
    }),
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        designation: zod_1.z.string().optional(),
        department: zod_1.z.string().optional()
    }),
});
exports.EmployeeValidations = {
    add, update
};
