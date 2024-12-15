"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../app/middlewares/auth"));
const user_1 = require("../../../enums/user");
const controllers_1 = require("./controllers");
const router = express_1.default.Router();
router.get('/stats', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), controllers_1.AttendanceControllers.stats);
router.get('/employee-sheet', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), controllers_1.AttendanceControllers.employeeSheet);
router.get('/my-sheet', (0, auth_1.default)(user_1.ENUM_USER_ROLE.MANAGER, user_1.ENUM_USER_ROLE.EMPLOYEE), controllers_1.AttendanceControllers.mySheet);
router.get('/attd-status', (0, auth_1.default)(user_1.ENUM_USER_ROLE.MANAGER, user_1.ENUM_USER_ROLE.EMPLOYEE), controllers_1.AttendanceControllers.attdStatus);
router.patch('/confirm-attendance', (0, auth_1.default)(user_1.ENUM_USER_ROLE.MANAGER, user_1.ENUM_USER_ROLE.EMPLOYEE), controllers_1.AttendanceControllers.confirmAttendance);
exports.AttendanceRoutes = router;
