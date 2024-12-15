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
exports.DashboardServices = void 0;
const manager_1 = require("../../../enums/manager");
const model_1 = __importDefault(require("../department/model"));
const model_2 = __importDefault(require("../manager/model"));
const model_3 = __importDefault(require("../project/model"));
const model_4 = __importDefault(require("../employee/model"));
const stats = () => __awaiter(void 0, void 0, void 0, function* () {
    const departments = yield model_1.default.find().countDocuments();
    const projects = yield model_3.default.find().countDocuments();
    const managers = yield model_2.default.find({ status: manager_1.ENUM_MANAGER_STATUS.ACTIVE }).countDocuments();
    const employees = yield model_4.default.find().countDocuments();
    return { departments, projects, managers, employees };
});
exports.DashboardServices = { stats };
