import { z } from 'zod';

const add = z.object({
    body: z.object({
        text: z.string({required_error: "Text is required"})
    })
})

export const AnnouncementValidations = { add };
