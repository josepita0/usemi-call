"use client"

import { cn } from "@/lib/utils"
import { Channel, MemberRole, Server } from "@prisma/client"
import { Calendar, Edit, Hash, Home, Lock, Mic, Plus, Trash, Video } from "lucide-react"
import { useParams } from "next/navigation"
import { useRouter } from 'next-nprogress-bar';
import { ActionTooltip } from "@/components/action-tooltip"
import { ModalType, useModal } from "@/hooks/use-modal-store"

interface IServerChannelProps {
    channel: Channel
    server: Server
    role?: MemberRole
}

const iconMap = {
    TEXT: Hash,
    AUDIO: Mic,
    VIDEO: Video,
    CALENDAR: Home
}


export const ServerChannel = ({channel, server, role}: IServerChannelProps) => {

    const allowedChannelType = ['TEXT', 'AUDIO', 'VIDEO']

    const { onOpen } = useModal()

    const params = useParams()

    const router = useRouter()    

    const Icon = iconMap[channel.type]

    const onClick = () => {

        if(allowedChannelType.includes(channel.type)){

            router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
            
        } else {

            router.push(`/servers/${params?.serverId}/calendar`)
            
        }

    }

    const onAction = (e: React.MouseEvent, action: ModalType ) => {
        console.log({action});
        
        e.stopPropagation()
        onOpen(action,{channel, server} )
    }

    return (
        <button

            onClick={onClick}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full    transition mb-1",
                    params?.channelId === channel.id ? "bg-brand" : "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
            )}
        >
            <Icon className={cn("flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400", params?.channelId === channel.id && "text-white")} />
            <p className={cn(
                "line-clamp-1 font-semibold text-sm text-zinc-500  dark:text-zinc-400  transition",
                    params?.channelId === channel.id ? "text-white" : "group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
            )}>
                {channel.name}
            </p>

            {channel.name !== "general" && role !== MemberRole.GUEST && channel.type !== "CALENDAR" && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionTooltip label="Editar">
                        <Edit 
                            onClick={(e) => onAction(e,"editChannel")}
                            className={cn("hidden group-hover:block w-4 h-4 text-zinc-500  dark:text-zinc-400  transition",
                            params?.channelId === channel.id ? "text-white" : "hover:text-zinc-600 dark:hover:text-zinc-300"
                            )}
                        />
                    </ActionTooltip>
                    <ActionTooltip label="Eliminar">
                        <Trash 
                            onClick={(e) => onAction(e,"deleteChannel")}
                            className={cn("hidden group-hover:block w-4 h-4 text-zinc-500  dark:text-zinc-400  transition",
                            params?.channelId === channel.id ? "text-white" : "hover:text-zinc-600 dark:hover:text-zinc-300"
                            )}
                        />
                    </ActionTooltip>
                </div>
            )}

            {
                channel.type === "CALENDAR" && (role === MemberRole.ADMIN || role === MemberRole.MODERATOR) && (

                    <div className="ml-auto flex items-center gap-x-2">
                        <ActionTooltip label="Crear evento">
                            <Plus 
                                onClick={(e) => onAction(e,"createCalendarEvent")}
                                className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                            />
                        </ActionTooltip>
                    </div>
                )
            }


            {
                channel.name === "general" && (
                    <Lock className={cn("ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400", params?.channelId === channel.id && "text-white")} />
                )
             }
        </button>

    )
}