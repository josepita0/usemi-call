import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4} from "uuid"

export async function PATCH(
    req: Request,
    {params}: {params: {serverId: string}}
) {

    try {
        
        const profile = await currentProfile()

        const { name, imageUrl } = await req.json()

        if(!profile){

            return new NextResponse("Operación no permitida", {status: 401})
        
        }

        if(!params.serverId){

            return new NextResponse("No se encontro el ID del servidor", {status: 400})

        }

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                name,
                imageUrl
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("[SERVER_ID_PATCH]", error);
        return new NextResponse("Internal Error", {status: 500})
        
    }
    
}