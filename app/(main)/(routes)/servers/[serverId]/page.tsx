import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface IServerIdPageProps {
    params:{
        serverId: string
    }
}

const ServerIdPage = async ({params}:IServerIdPageProps) => {

    const profile = await currentProfile()

    if(!profile){
        return redirectToSignIn()
    }

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: "wall"
                },
                orderBy: {
                    createdAt:"asc"
                }
            },
            
        }
    })

    const initialChannel = server?.channels[0]
    
    if(initialChannel?.name !== "wall") return null

    return redirect(`/servers/${params?.serverId}/home`)

}
 
export default ServerIdPage;