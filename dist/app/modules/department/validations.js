"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentValidations = void 0;
const zod_1 = require("zod");
const add = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' })
    }),
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }).optional(),
        employee: zod_1.z.string({ required_error: 'Manager is required' }).optional(),
    }),
});
exports.DepartmentValidations = {
    add, update
};
