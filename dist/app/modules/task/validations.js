"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskValidations = void 0;
const zod_1 = require("zod");
const add = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }),
        assignedTo: zod_1.z.string({ required_error: 'Assignee is required' }),
        project: zod_1.z.string({ required_error: 'Project is required' })
    }),
});
const update = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        assignedTo: zod_1.z.string().optional(),
        status: zod_1.z.string().optional()
    }),
});
exports.TaskValidations = { add, update };
