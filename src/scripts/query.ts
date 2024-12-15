/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import User from '@/app/modules/user/model';
import { ENUM_USER_ROLE } from '@/enums/user';
import express from 'express';
const router = express.Router();

router.get('/', async(req, res) => {
    const result = await User.deleteMany({ role: { '$ne': ENUM_USER_ROLE.ADMIN } })
    res.send({result})
});

export const QueryRoutes = router;
