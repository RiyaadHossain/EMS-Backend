/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { JwtPayload } from 'jsonwebtoken';

type UserInfo = {
  role: string
  userId: string
}

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload | null | UserInfo;
    }
  }
}
