import { z } from 'zod';

const add = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    assignedTo: z.string({ required_error: 'Assignee is required' }),
    project: z.string({ required_error: 'Project is required' })
  }),
});

const update = z.object({
    body: z.object({
        name: z.string().optional(),
        assignedTo: z.string().optional(),
        status: z.string().optional()
      }),
});

export const TaskValidations = { add, update };
