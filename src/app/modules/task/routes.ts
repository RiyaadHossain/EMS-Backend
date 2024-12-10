import express from 'express';
import validateRequest from '@/app/middlewares/validateRequest';
import auth from '@/app/middlewares/auth';
import { ENUM_USER_ROLE } from '@/enums/user';
import { TaskValidations } from './validations';
import { TaskControllers } from './controllers';
const router = express.Router();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.EMPLOYEE),
  TaskControllers.get
);

router.get(
  '/:projectId',
  auth(ENUM_USER_ROLE.MANAGER),
  TaskControllers.getByProject
);

router.post(
  '/add',
  auth(ENUM_USER_ROLE.MANAGER),
  validateRequest(TaskValidations.add),
  TaskControllers.add
);

router.patch(
  '/update/:id',
  auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.EMPLOYEE),
  validateRequest(TaskValidations.update),
  TaskControllers.update
);

router.delete(
  '/remove/:id',
  auth(ENUM_USER_ROLE.MANAGER),
  TaskControllers.remove
);

export const TaskRoutes = router;
