import { redirect, useRouter } from "next/navigation";
import { ChannelType, MemberRole } from "@prisma/client";
import { Calendar, Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ServerSearch } from "./server-search";
import { ServerHeader } from "./server-header";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";
import { useEffect } from "react";

interface IServerSidebarProps{
    serverId: string;
}

const iconMap: Record<ChannelType, React.ReactNode> = {
    TEXT: <Hash className="mr-2 h-4 w-4"/>,
    AUDIO: <Mic className="mr-2 h-4 w-4"/>,
    VIDEO: <Video className="mr-2 h-4 w-4"/>,
    CALENDAR: <Calendar className="mr-2 h-4 w-4"/>,
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

            <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>

            <div className="mb-2">
                    <ServerSection
                        sectionType="channels"
                        channelType={"CALENDAR"}
                        role={role}
                        label="Recursos"
                    />

                    <div
                        className="space-y-[2px]"
                    >

                        <ServerChannel 
                            channel={{
                                type:"CALENDAR" as "TEXT",
                                name: "Calendario",
                                createdAt: new Date,
                                id: '',
                                profileId: profile.id,
                                serverId, 
                                updatedAt:new Date()
                            }}
                            server={server}
                            role={role}
                        />
                    </div>

            </div>

            {!!textChannels?.length && (
                <div className="mb-2">
                    <ServerSection
                        sectionType="channels"
                        channelType={ChannelType.TEXT}
                        role={role}
                        label="Canales de Texto"
                    />

                    <div
                        className="space-y-[2px]"
                    >

                    {textChannels.map((channel)=> (
                        <ServerChannel 
                            key={channel.id}
                            channel={channel}
                            server={server}
                            role={role}
                        />
                    ))}
                    </div>

                </div>
            )}

            {!!audioChannels?.length && (
                <div className="mb-2">
                    <ServerSection
                        sectionType="channels"
                        channelType={ChannelType.AUDIO}
                        role={role}
                        label="Canales de Audio"
                    />
                        <div
                        className="space-y-[2px]"
                    >

                    {audioChannels.map((channel)=> (
                        <ServerChannel 
                            key={channel.id}
                            channel={channel}
                            server={server}
                            role={role}
                        />
                    ))}
                    </div>
                </div>
            )}

            {!!videoChannels?.length && (
                <div className="mb-2">
                    <ServerSection
                        sectionType="channels"
                        channelType={ChannelType.VIDEO}
                        role={role}
                        label="Canales de Video"
                    />
                        <div
                        className="space-y-[2px]"
                    >

                    {videoChannels.map((channel)=> (
                        <ServerChannel 
                            key={channel.id}
                            channel={channel}
                            server={server}
                            role={role}
                        />
                    ))}
                    </div>
                </div>
            )}

            {!!members?.length && (
                <div className="mb-2">
                    <ServerSection
                        sectionType="members"
                        role={role}
                        label="Integrantes"
                        server={server}
                    />
                        <div
                        className="space-y-[2px]"
                    >

                    </div>
                    {members.map((member)=> (
                        <ServerMember
                            key={member.id}
                            member={member}
                            server={server}
                        />
                    ))}
                </div>
            )}


            </ScrollArea>

        </div>
     );
}
 
