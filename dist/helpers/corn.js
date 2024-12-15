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
const model_1 = __importDefault(require("../app/modules/attendance/model"));
const model_2 = __importDefault(require("../app/modules/employee/model"));
const node_cron_1 = __importDefault(require("node-cron"));
const initiailzeAttdSheet = () => __awaiter(void 0, void 0, void 0, function* () {
    // Cron expression for the last day of the month at midnight
    const lastDayCron = '59 23 28-31 * *'; // test = "*/1 * * * *" (every minute)
    node_cron_1.default.schedule(lastDayCron, () => __awaiter(void 0, void 0, void 0, function* () {
        const today = new Date();
        const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        // Check if today is the last day of the month
        if (tomorrow.getDate() === 1) {
            const employees = yield model_2.default.find();
            employees.forEach((employee) => __awaiter(void 0, void 0, void 0, function* () {
                const sheetData = {
                    month: tomorrow.getMonth(),
                    year: tomorrow.getFullYear(),
                    user: employee.user,
                };
                const attendance = yield model_1.default.find(sheetData);
                if (!attendance)
                    yield model_1.default.create(sheetData);
            }));
        }
    }));
});
exports.default = initiailzeAttdSheet;
