"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectValidations = void 0;
const zod_1 = require("zod");
const add = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
        department: zod_1.z.string({ required_error: 'Department is required' }),
        issueDate: zod_1.z.string({ required_error: 'Issue Date is required' }),
        expectedEndDate: zod_1.z.string({ required_error: 'Expected End Date is required' }),
    }),
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        status: zod_1.z.string().optional(),
        expectedEndDate: zod_1.z.string().optional(),
    }),
});
exports.ProjectValidations = { add, update };
