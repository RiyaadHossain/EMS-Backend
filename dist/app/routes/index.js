"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("../modules/auth/routes");
const routes_2 = require("../modules/user/routes");
const routes_3 = require("../modules/department/routes");
const routes_4 = require("../modules/employee/routes");
const routes_5 = require("../modules/manager/routes");
const routes_6 = require("../modules/project/routes");
const routes_7 = require("../modules/task/routes");
const routes_8 = require("../modules/notification/routes");
const routes_9 = require("../modules/announcement/routes");
const routes_10 = require("../modules/attendance/routes");
const routes_11 = require("../modules/dashboard/routes");
const routes_12 = require("../modules/profile/routes");
const query_1 = require("../../scripts/query");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        routes: routes_1.AuthRoutes
    },
    {
        path: "/user",
        routes: routes_2.UserRoutes
    },
    {
        path: "/department",
        routes: routes_3.DepartmentRoutes
    },
    {
        path: "/employee",
        routes: routes_4.EmployeeRoutes
    },
    {
        path: "/manager",
        routes: routes_5.ManagerRoutes
    },
    {
        path: "/project",
        routes: routes_6.ProjectRoutes
    },
    {
        path: "/task",
        routes: routes_7.TaskRoutes
    },
    {
        path: "/announcement",
        routes: routes_9.AnnouncementRoutes
    },
    {
        path: "/notification",
        routes: routes_8.NotificationRoutes
    },
    {
        path: "/attendance",
        routes: routes_10.AttendanceRoutes
    },
    {
        path: "/dashboard",
        routes: routes_11.DashboardRoutes
    },
    {
        path: "/profile",
        routes: routes_12.ProfileRoutes
    },
    {
        path: "/script",
        routes: query_1.QueryRoutes
    }
];
moduleRoutes.forEach(route => router.use(route.path, route.routes));
exports.default = router;
