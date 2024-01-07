import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

interface IServerSidebarProps{
    serverId: string;
}

const iconMap: Record<ChannelType, React.ReactNode> = {
    TEXT: <Hash className="mr-2 h-4 w-4"/>,
    AUDIO: <Mic className="mr-2 h-4 w-4"/>,
    VIDEO: <Video className="mr-2 h-4 w-4"/>
}

const roleIconMap: Record<MemberRole, React.ReactNode | null > = {
    ADMIN: <ShieldAlert className='h-4 w-4 mr-2 text-rose-500'/>,
    MODERATOR: <ShieldCheck className='h-4 w-4 mr-2 text-indigo-500'/>,
    GUEST: null
}

export const ServerSidebar = async ({serverId}: IServerSidebarProps) => {



    const profile = await currentProfile()

    if(!profile){
        return redirect("/")
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include:{
            channels:{
                orderBy:{
                    createdAt: "asc"
                }
            },
            members:{
                include:{
                    profile:true
                },
                orderBy:{
                    role: "asc"
                }
            }

        }
    })

    const textChannels = server?.channels.filter((c) => c.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter((c) => c.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter((c) => c.type === ChannelType.VIDEO)
    const members = server?.members.filter((m) => m.profileId !== profile.id)

    if(!server){
        return redirect("/");
    }

    const role = server?.members.find((m) => m.profileId === profile.id)?.role;



    return ( 
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            
            <ServerHeader
                server={server}
                role={role}
            />

            <ScrollArea
                className="flex-1 px-3"
            >
                <div
                    className="mt-2"
                >
                    <ServerSearch
                        data={[
                           {
                            label: "Canales de texto",
                            type: "channel",
                            data: textChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                           },
                           {
                            label: "Canales de audio",
                            type: "channel",
                            data: audioChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                           },
                           {
                            label: "Canales de video",
                            type: "channel",
                            data: videoChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: iconMap[channel.type]
                            }))
                           },
                           {
                            label: "Integrantes",
                            type: "member",
                            data: members?.map((member) => ({
                                id: member.id,
                                name: member. profile.name,
                                icon: roleIconMap[member.role]
                            }))
                           },
                        ]}
                    />
                </div>
            </ScrollArea>

        </div>
     );
}
 
