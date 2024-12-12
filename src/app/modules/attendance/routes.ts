import express from 'express';
import auth from '@/app/middlewares/auth';
import { ENUM_USER_ROLE } from '@/enums/user';
import { AttendanceControllers } from './controllers';
const router = express.Router();

router.get(
  '/stats',
  auth(ENUM_USER_ROLE.ADMIN),
  AttendanceControllers.stats
);

router.get(
  '/employee-sheet',
  auth(ENUM_USER_ROLE.ADMIN),
  AttendanceControllers.employeeSheet
);

router.get(
  '/my-sheet',
  auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.EMPLOYEE),
  AttendanceControllers.mySheet
);

router.get(
  '/attd-status',
  auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.EMPLOYEE),
  AttendanceControllers.attdStatus
);

router.patch(
  '/confirm-attendance',
  auth(ENUM_USER_ROLE.MANAGER, ENUM_USER_ROLE.EMPLOYEE),
  AttendanceControllers.confirmAttendance
);

export const AttendanceRoutes = router;
