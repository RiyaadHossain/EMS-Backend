import express from 'express';
import auth from '@/app/middlewares/auth';
import { ENUM_USER_ROLE } from '@/enums/user';
import { ProfileControllers } from './controllers';
import validateRequest from '@/app/middlewares/validateRequest';
import { ProfileValidations } from './validations';
const router = express.Router();

router.get(
  '/me',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.EMPLOYEE),
  ProfileControllers.me
);

router.patch(
  '/update',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.EMPLOYEE),
  validateRequest(ProfileValidations.update),
  ProfileControllers.update
);


export const ProfileRoutes = router;
