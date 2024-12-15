import express from 'express';
import auth from '@/app/middlewares/auth';
import { ENUM_USER_ROLE } from '@/enums/user';
import { DashboardControllers } from './controllers';
const router = express.Router();

router.get(
  '/stats',
  auth(ENUM_USER_ROLE.ADMIN),
  DashboardControllers.stats
);


export const DashboardRoutes = router;
