import { Channel, Member, MemberRole } from "@prisma/client"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"

interface HomePageProps {
    channel: Channel
    member: any
    members: any
 }
export const Wall = ({member, channel, members}: HomePageProps) => {
    
    return (
        <div className="flex flex-col h-full max-h-[50vh] sm:max-h-[75vh] dark:bg-[#2B2D31] bg-[#F2F3F5] justify-center rounded-md border-2 border-[#163273] dark:border-[#083a63]">
             
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

                {
                    member?.role === MemberRole.ADMIN && (
                        <ChatInput
                            member={member}
                            apiUrl="/api/socket/messages"
                            type="wall"
                            members={members}
                            name={channel.name}
                            query={{
                                channelId: channel.id,
                                serverId: channel.serverId
                            }}
                        />
                    )
                }
                    
        </div>
    )
}

