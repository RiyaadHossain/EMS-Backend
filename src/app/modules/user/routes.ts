
import express from 'express';
import { UserValidations } from './validations';
import { UserControllers } from './controllers';
import validateRequest from '@/app/middlewares/validateRequest';
const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidations.register),
  UserControllers.register
);


export const UserRoutes = router;
