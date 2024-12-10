import { z } from 'zod';

const add = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Must be an email'),
    phone: z.string({ required_error: 'Phone is required' }),
    designation: z.string({ required_error: 'Designation is required' }),
    department: z.string({ required_error: 'Designation is required' })
  }),
});

const update = z.object({
  body: z.object({
    designation: z.string().optional(),
    department: z.string().optional()
  }),
});

export const EmployeeValidations = {
  add,update
};
