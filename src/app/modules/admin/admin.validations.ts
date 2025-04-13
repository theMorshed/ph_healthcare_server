import { z } from 'zod';

export const updateAdminSchema = z.object({
    body: z.object({
        name: z.string(),
        contactNumber: z.string().optional()
    })
});