
import express from 'express';
import { AuthValidations } from './validations';
import { AuthControllers } from './controllers';
import validateRequest from '@/app/middlewares/validateRequest';
const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidations.login),
  AuthControllers.login
);


export const AuthRoutes = router;
