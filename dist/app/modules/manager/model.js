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
const manager_1 = require("../../../enums/manager");
const mongoose_1 = require("mongoose");
const managerSchema = new mongoose_1.Schema({
    employee: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Employee', required: true },
    status: {
        type: String,
        enum: Object.values(manager_1.ENUM_MANAGER_STATUS),
        default: manager_1.ENUM_MANAGER_STATUS.ACTIVE,
    },
}, { timestamps: true });
managerSchema.statics.isManagerExist = function (employee) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExist = yield Manager.findOne({
            employee,
            status: manager_1.ENUM_MANAGER_STATUS.ACTIVE,
        });
        return isExist;
    });
};
const Manager = (0, mongoose_1.model)('Manager', managerSchema);
exports.default = Manager;
