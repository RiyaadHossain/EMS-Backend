import express from 'express';
import { EmployeeValidations } from './validations';
import { EmployeeControllers } from './controllers';
import validateRequest from '@/app/middlewares/validateRequest';
import auth from '@/app/middlewares/auth';
import { ENUM_USER_ROLE } from '@/enums/user';
const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MANAGER),
  EmployeeControllers.get
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MANAGER),
  EmployeeControllers.getDetails
);


router.get(
  '/get-select-options/:department',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MANAGER),
  EmployeeControllers.getSelectOptions
);

router.post(
  '/add',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(EmployeeValidations.add),
  EmployeeControllers.add
);

router.patch(
  '/update/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  validateRequest(EmployeeValidations.update),
  EmployeeControllers.update
);


export const EmployeeRoutes = router;
