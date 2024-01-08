import * as z from "zod"

export const chatInputSchema = z.object({
    content: z.string().min(1),
})

export const chatItemSchema = z.object({
    content: z.string().min(1),
})

export interface IChatInput extends z.infer<typeof chatInputSchema> {}
export interface IChatItem extends z.infer<typeof chatItemSchema> {}
