import { ChatHeader } from "@/components/chat/chat-header"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatItemVerify } from "@/components/chat/chat-item-verify"
import { ChatMessages } from "@/components/chat/chat-messages"
import { MediaRoom } from "@/components/media-room/media-room"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirectToSignIn } from "@clerk/nextjs"
import { ChannelType } from "@prisma/client"
import { redirect } from "next/navigation"

interface IChannelIdPage {
    params: {
        serverId: string
        channelId: string
    }
}

const ChannelIdPage = async ({params}:IChannelIdPage) => {

    const profile = await currentProfile()

    if(!profile){
        return redirectToSignIn()
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
        },
        include: {
            members: {
                include: {
                    profile: true
                }
            }
        }
    })

    const channel = await db.channel.findUnique({
        where:{
            id: params.channelId
        }
    })

    const member = await db.member.findFirst({
        where:{
            serverId: params.serverId,
            profileId: profile.id
        },
        include:{
            server: true,
            profile: true
        }
    })
 
    

    if(!channel || !member){
        redirect(`/`)
    }



    return (  
        <div className="bg-white dark:bg-[#313338] flex flex-col justify-between h-full">
            <ChatHeader
                name={channel.name}
                serverId={channel.serverId}
                type="channel"
            />

            {/* <Test/> */}

            {
                channel.type === ChannelType.TEXT && (
                    <>
                   <ChatMessages
                        member={member}
                        name={channel.name}
                        chatId={channel.id}
                        type="channel"
                        apiUrl="/api/messages"
                        socketUrl="/api/socket/messages"
                        socketQuery={{
                        channelId: channel.id,
                        serverId: channel.serverId,
                        }}
                        paramKey="channelId"
                        paramValue={channel.id}
                    />

                        <ChatInput
                            member={member}
                            apiUrl="/api/socket/messages"
                            type="channel"
                            name={channel.name}
                            query={{
                                channelId: channel.id,
                                serverId: channel.serverId
                            }}
                        />
                    </>
                )
            }

            {
                channel.type === ChannelType.AUDIO && (
                    <MediaRoom
                        server={server}
                        channelName={channel.name}
                        member={member}
                        chatId={channel.id}
                        video={false}
                        audio={true}
                    />
                )
            }

            {
                channel.type === ChannelType.VIDEO && (
                    <MediaRoom
                        server={server}
                        channelName={channel.name}
                        member={member}
                        chatId={channel.id}
                        video={true}
                        audio={true}
                    />
                )
            }

        </div>
    );
}
 
export default ChannelIdPage;