import * as z from "zod"

export const initialModalSchema = z.object({
    name: z.string().min(1, {message: "El nombre del servidor es requerido"}),
    imageUrl: z.string().min(1, {message: "La imagen del servidor es requerida"})
})

export interface IInitialModal extends z.infer<typeof initialModalSchema> {}
