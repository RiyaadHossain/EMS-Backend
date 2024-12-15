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
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = require("mongoose");
const project_1 = require("../../../enums/project");
const projectSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    department: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Department',
        required: true,
    },
    manager: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Manager', required: true },
    issueDate: { type: Date, required: true },
    expectedEndDate: { type: Date, required: true },
    status: {
        type: String,
        enum: Object.values(project_1.ENUM_PROJECT_STATUS),
        default: project_1.ENUM_PROJECT_STATUS.TO_DO,
    },
}, { timestamps: true });
projectSchema.statics.isProjectExist = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExist = yield Project.findById(id);
        return isExist;
    });
};
const Project = (0, mongoose_1.model)('Project', projectSchema);
exports.default = Project;
