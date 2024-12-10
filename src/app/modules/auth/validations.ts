import { z } from 'zod';

const login = z.object({
  body: z.object({
    userId: z.string({ required_error: 'User Id is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const AuthValidations = {
  login,
};
