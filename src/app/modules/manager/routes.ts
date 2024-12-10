import express from 'express';
import auth from '@/app/middlewares/auth';
import { ENUM_USER_ROLE } from '@/enums/user';
import { ManagerControllers } from './controllers';
const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN),
  ManagerControllers.get
);


export const ManagerRoutes = router;
