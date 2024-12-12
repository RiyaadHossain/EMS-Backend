import express from 'express';
import auth from '@/app/middlewares/auth';
import { ENUM_USER_ROLE } from '@/enums/user';
import { NotificationControllers } from './controllers';
const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.EMPLOYEE),
  NotificationControllers.get
);

router.patch(
  '/read-all',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.EMPLOYEE),
  NotificationControllers.readAll
);

export const NotificationRoutes = router;
