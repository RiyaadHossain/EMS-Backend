"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementValidations = void 0;
const zod_1 = require("zod");
const add = zod_1.z.object({
    body: zod_1.z.object({
        text: zod_1.z.string({ required_error: "Text is required" })
    })
});
exports.AnnouncementValidations = { add };
