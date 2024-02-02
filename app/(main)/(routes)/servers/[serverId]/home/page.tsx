import { ChatHeader } from "@/components/chat/chat-header";
import { HomeComponent } from "@/components/home";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { ChannelType } from "@prisma/client";


interface HomePageProps {
   params: {
       serverId: string,
   }
}

const HomePage = async ({params}:HomePageProps) => {

    const profile = await currentProfile()

    if(!profile){
        return redirectToSignIn()
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
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

    const members = server
    
    const channelId = textChannels?.find(t => t.name === 'wall')?.id
    

    const channel = await db.channel.findUnique({
        where:{
            id: channelId
        },
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
 

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col justify-between h-full">
             <ChatHeader
                name={"Inicio"}
                serverId={params.serverId}
                type="channel"
            />

            <HomeComponent
                member={member}
                members={members}
                channel={channel}
            />
            


        </div>
    );
}
 
export default HomePage;