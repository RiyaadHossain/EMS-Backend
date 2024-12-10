import { z } from 'zod';

const add = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' })
  }),
});

const update = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
    employee: z.string({ required_error: 'Manager is required' }).optional(),
  }),
});

export const DepartmentValidations = {
  add,update
};
