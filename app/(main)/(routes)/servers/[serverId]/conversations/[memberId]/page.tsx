import { ChatHeader } from "@/components/chat/chat-header"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatMessages } from "@/components/chat/chat-messages"
import { MediaRoom } from "@/components/media-room"
import { getOrCreateConversation } from "@/lib/conversation"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"

interface IMemberIdPage {
    params: {
        memberId: string
        serverId: string
    },
    searchParams:{
        video?:boolean
    }
}

const MemberIdPage = async ({params,searchParams}:IMemberIdPage) => {

    const profile = await currentProfile()

    if(!profile){
        return redirectToSignIn()
    }

    const currentMember = await db.member.findFirst({
        where:{
            serverId: params.serverId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    })

    if(!currentMember){
        return redirect("/")
    }

    const conversation = await getOrCreateConversation(currentMember.id, params.memberId)

    if(!conversation){
        return redirect(`/servers/${params.serverId}`)
    }

    const { memberOne, memberTwp} = conversation;

    const otherMember = memberOne.profileId === profile.id ? memberTwp : memberOne;


    return ( 
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            
            <ChatHeader 
                name={otherMember.profile.name}
                serverId={params.serverId}
                type="conversation"
                imageUrl={otherMember.profile.imageUrl}
            />

            {searchParams.video && (
                <MediaRoom
                    chatId={conversation.id}
                    audio={true}
                    video={true}
                />
            )}

            {!searchParams.video && (
                <>
                    <ChatMessages
                        member={currentMember}
                        name={otherMember.profile.name}
                        type="conversation"
                        chatId={conversation.id}
                        apiUrl="/api/direct-messages"
                        paramKey="conversationsId"
                        paramValue={conversation.id}
                        socketUrl="/api/socket/direct-messages"
                        socketQuery={{
                            conversationsId: conversation.id
                        }}

                    />

                    <ChatInput 
                        name={otherMember.profile.name}
                        type="conversation"
                        apiUrl="/api/socket/direct-messages"
                        query={{
                            conversationsId: conversation.id
                        }}
                    />
                </>
            )}



        </div>
    );
}
 
export default MemberIdPage;