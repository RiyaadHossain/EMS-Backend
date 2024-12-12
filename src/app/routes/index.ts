import express from 'express';
import { AuthRoutes } from '../modules/auth/routes';
import { UserRoutes } from '../modules/user/routes';
import { DepartmentRoutes } from '../modules/department/routes';
import { EmployeeRoutes } from '../modules/employee/routes';
import { ManagerRoutes } from '../modules/manager/routes';
import { ProjectRoutes } from '../modules/project/routes';
import { TaskRoutes } from '../modules/task/routes';
import { NotificationRoutes } from '../modules/notification/routes';
import { AnnouncementRoutes } from '../modules/announcement/routes';
import { AttendanceRoutes } from '../modules/attendance/routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    routes: AuthRoutes
  },
  {
    path: "/user",
    routes: UserRoutes
  },
  {
    path: "/department",
    routes: DepartmentRoutes
  },
  {
    path: "/employee",
    routes: EmployeeRoutes
  },
  {
    path: "/manager",
    routes: ManagerRoutes
  },
  {
    path: "/project",
    routes: ProjectRoutes
  },
  {
    path: "/task",
    routes: TaskRoutes
  },
  {
    path: "/announcement",
    routes: AnnouncementRoutes
  },
  {
    path: "/notification",
    routes: NotificationRoutes
  },
  {
    path: "/attendance",
    routes: AttendanceRoutes
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
