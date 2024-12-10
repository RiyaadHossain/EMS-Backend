import express from 'express';
import validateRequest from '@/app/middlewares/validateRequest';
import auth from '@/app/middlewares/auth';
import { ENUM_USER_ROLE } from '@/enums/user';
import { ProjectValidations } from './validations';
import { ProjectControllers } from './controllers';
const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.EMPLOYEE),
  ProjectControllers.get
);

router.get(
  '/get-select-options',
  auth(ENUM_USER_ROLE.MANAGER),
  ProjectControllers.getSelectOptions
);

router.post(
  '/add',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(ProjectValidations.add),
  ProjectControllers.add
);

router.patch(
  '/update/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MANAGER),
  validateRequest(ProjectValidations.update),
  ProjectControllers.update
);

router.delete(
  '/remove/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ProjectControllers.remove
);

export const ProjectRoutes = router;
