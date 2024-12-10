import { z } from 'zod';

const add = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    department: z.string({ required_error: 'Department is required' }),
    issueDate: z.string({ required_error: 'Issue Date is required' }),
    expectedEndDate: z.string({ required_error: 'Expected End Date is required' }),
  }),
});

const update = z.object({
    body: z.object({
        name: z.string().optional(),
        status: z.string().optional(),
        expectedEndDate: z.string().optional(),
      }),
});

export const ProjectValidations = { add, update };
