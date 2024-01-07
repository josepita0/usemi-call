import { ChatHeader } from "@/components/chat/chat-header"
import { getOrCreateConversation } from "@/lib/conversation"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { redirectToSignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"

interface IMemberIdPage {
    params: {
        memberId: string
        serverId: string
    }
}

const MemberIdPage = async ({params}:IMemberIdPage) => {

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

        </div>
    );
}
 
export default MemberIdPage;