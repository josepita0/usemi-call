import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params}:{params: {serverId: string}}
) {

    try {

        const profile = await currentProfile()

        if(!profile){

            return new NextResponse("Operación no permitida", {status: 401})
        
        }

        if(!params.serverId){

            return new NextResponse("No se encontro el ID del servidor", {status: 400})

        }
        

        const server = await db.server.update({
            where:{
                id: params.serverId,
                profileId:{
                    not: profile.id
                },
                members:{
                    some: {
                        profileId: profile.id
                    }
                }
                
            },
            data: {
                members: {
                    deleteMany:{
                        profileId: profile.id
                    }
                }
            }
        })

        return NextResponse.json(server)
    } catch (error) {
        console.log("[SERVER_ID_LEAVER]", error);
        return new NextResponse("Internal Error", {status:500})
    }
    
}