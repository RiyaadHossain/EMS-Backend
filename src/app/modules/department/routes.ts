import express from 'express';
import { DepartmentValidations } from './validations';
import { DepartmentControllers } from './controllers';
import validateRequest from '@/app/middlewares/validateRequest';
import auth from '@/app/middlewares/auth';
import { ENUM_USER_ROLE } from '@/enums/user';
const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN),
  DepartmentControllers.get
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  DepartmentControllers.getDetails
);

router.get(
  '/get-select-options',
  auth(ENUM_USER_ROLE.ADMIN),
  DepartmentControllers.getSelectOptions
);

router.post(
  '/add',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(DepartmentValidations.add),
  DepartmentControllers.add
);

router.patch(
  '/update/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(DepartmentValidations.update),
  DepartmentControllers.update
);

router.delete(
  '/remove/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  DepartmentControllers.remove
);

export const DepartmentRoutes = router;
