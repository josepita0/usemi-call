import { AppointmentMeta } from "@devexpress/dx-react-scheduler";
import { Calendar, Channel, ChannelType, Member, Profile, Server } from "@prisma/client";
import { create } from "zustand"

export type ModalType = "createServer" | "invite" | "editServer" 
| "members" | "createChannel" | "leaveServer" | "deleteServer"  | "deleteChannel" | "editChannel"
    | "messageFile" | "deleteMessage" | "createCalendarEvent" | "editCalendarEvent" | "deleteCalendarEvent"
;

interface ModalData {
    server?: Server
    channel?:Channel
    members?: Member & {profile: Profile}[],
    channelType?: ChannelType | "CALENDAR"
    type?: string
    apiUrl?:string
    calendar?: AppointmentMeta,
    query?: Record<string, any>
}

interface ModalStore {
    type: ModalType | null
    data: ModalData
    isOpen: boolean
    onOpen: (type: ModalType, data?: ModalData) => void
    onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    data: {},
    isOpen: false,
    onOpen: (type, data = {}) => set({isOpen: true, type, data}),
    onClose: () => set({isOpen: false, type: null}),
}))