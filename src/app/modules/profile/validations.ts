import { z } from "zod";

const update = z.object({
    body: z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
    })
})

export const ProfileValidations = {update}