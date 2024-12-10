import { z } from 'zod';

const register = z.object({
  body: z.object({
    companyName: z.string({ required_error: 'Company Name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Must be an email'),
    phone: z.string({ required_error: 'Phone is required' }),
    address: z.string(),
  }),
});

export const UserValidations = {
  register,
};
