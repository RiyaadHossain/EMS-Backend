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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = require("mongoose");
const designation_1 = require("../../../enums/designation");
const model_1 = __importDefault(require("../user/model"));
const employeeSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    department: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Department', required: true },
    designation: {
        type: String,
        enum: Object.values(designation_1.ENUM_DESIGNATION),
    },
}, { timestamps: true });
employeeSchema.statics.isEmployeeExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExist = yield model_1.default.findOne({ email });
        return isExist;
    });
};
const Employee = (0, mongoose_1.model)('Employee', employeeSchema);
exports.default = Employee;
