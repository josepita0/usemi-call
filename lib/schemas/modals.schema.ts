import { ChannelType } from "@prisma/client"
import * as z from "zod"

export const initialModalSchema = z.object({
    name: z.string().min(1, {message: "El nombre del servidor es requerido"}),
    imageUrl: z.string().min(1, {message: "La imagen del servidor es requerida"})
})

export const messageFileModalSchema = z.object({
  fileUrl: z.string().min(1, {message: "El soporte es requerida"})
})


export const channelModalSchema = z.object({
    name: z.string().min(1, {
        message: "El nombre del canal es requerido"
    }).refine( name => name !== "general", {message: "El canal no puede llamarse 'general'"}),
    type: z.nativeEnum(ChannelType, {
        errorMap: (issue, ctx) => {
          return {message: 'El tipo de canal es requerido '};
        },
      })   
})

export const calendarEventModalSchema = z.object({
  title:  z.string().min(1, {
    message: "El titulo del evento es requerido"
  }),
  startDate: z.date().optional(),
  endDate: z.date().optional()

})

export interface IInitialModal extends z.infer<typeof initialModalSchema> {}
export interface IChannelModal extends z.infer<typeof channelModalSchema> {}
export interface IMessageFileModal extends z.infer<typeof messageFileModalSchema> {}
export interface ICalendarEventModal extends z.infer<typeof calendarEventModalSchema> {}
