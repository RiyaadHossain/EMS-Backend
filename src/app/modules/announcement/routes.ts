import express from 'express';
import auth from '@/app/middlewares/auth';
import { ENUM_USER_ROLE } from '@/enums/user';
import { AnnouncementControllers } from './controllers';
import validateRequest from '@/app/middlewares/validateRequest';
import { AnnouncementValidations } from './validations';
const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.EMPLOYEE),
  AnnouncementControllers.get
);

router.post(
  '/add',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MANAGER),
  validateRequest(AnnouncementValidations.add),
  AnnouncementControllers.add
);

export const AnnouncementRoutes = router;
