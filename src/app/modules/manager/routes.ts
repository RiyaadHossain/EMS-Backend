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


router.get(
  '/get-select-options',
  auth(ENUM_USER_ROLE.ADMIN),
  ManagerControllers.getSelectOptions
);

router.get(
  '/my-manager',
  auth(ENUM_USER_ROLE.EMPLOYEE),
  ManagerControllers.getMyManager
);

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN),
  ManagerControllers.getDetails
);

export const ManagerRoutes = router;
