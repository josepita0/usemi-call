import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    {params}: {params: {channelId: string}}
) {

    try {
        
        const profile = await currentProfile()

        const {searchParams} = new URL(req.url)

        const serverId = searchParams.get("serverId")

        if(!profile){

            return new NextResponse("Operación no permitida", {status: 401})
        
        }

        if(!serverId){

            return new NextResponse("No se encontro el ID del servidor", {status: 400})

        }

        if(!params.channelId){

            return new NextResponse("No se encontro el ID del canal", {status: 400})

        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members:{
                    some:{
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data:{
                channels:{
                    delete:{
                        id: params.channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }

        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("[CHANNEL_ID_DELETE]", error);
        return new NextResponse("Internal Error", {status: 500})
        
    }
    
}

export async function PATCH(
    req: Request,
    {params}: {params: {channelId: string}}
) {

    try {
        
        const profile = await currentProfile()

        const { name, type } = await req.json()

        const {searchParams} = new URL(req.url)

        const serverId = searchParams.get("serverId")

        if(!profile){

            return new NextResponse("Operación no permitida", {status: 401})
        
        }

        if(!serverId){

            return new NextResponse("No se encontro el ID del servidor", {status: 400})

        }

        if(!params.channelId){

            return new NextResponse("No se encontro el ID del canal", {status: 400})

        }

        if(name === "general"){
            return new NextResponse("El nombre no puede ser general", {status: 400})
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels:{
                    update:{
                        where:{
                            id: params.channelId,
                            name:{
                                not: "general"
                            }
                        },
                        data:{
                            name,
                            type
                        }
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("[CHANNEL_ID_PATCH]", error);
        return new NextResponse("Internal Error", {status: 500})
        
    }
    
}
