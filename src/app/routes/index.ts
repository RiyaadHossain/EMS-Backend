import express from 'express';
import { AuthRoutes } from '../modules/auth/routes';
import { UserRoutes } from '../modules/user/routes';
import { DepartmentRoutes } from '../modules/department/routes';
import { EmployeeRoutes } from '../modules/employee/routes';
import { ManagerRoutes } from '../modules/manager/routes';

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
];

moduleRoutes.forEach(route => router.use(route.path, route.routes));
export default router;
