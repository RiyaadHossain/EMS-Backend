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
const task_1 = require("../../../enums/task");
const taskSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    project: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    assignedTo: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Employee', required: true },
    status: {
        type: String,
        enum: Object.values(task_1.ENUM_TASK_STATUS),
        default: task_1.ENUM_TASK_STATUS.TO_DO,
    },
}, { timestamps: true });
taskSchema.statics.isTaskExist = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExist = yield Task.findById(id);
        return isExist;
    });
};
const Task = (0, mongoose_1.model)('Task', taskSchema);
exports.default = Task;
