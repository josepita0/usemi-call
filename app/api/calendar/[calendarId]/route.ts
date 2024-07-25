import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request,
    {params}: {params: {calendarId: string}}
) {
    console.log({params});
 
    try {
        
        const profile = await currentProfile()

        const { startDate, endDate, title } = await req.json()

        const {searchParams} = new URL(req.url)

        const serverId = searchParams.get("serverId")

        if(!profile){

            return new NextResponse("Operación no permitida", {status: 401})
        
        }

        if(!serverId){

            return new NextResponse("No se encontro el ID del salón", {status: 400})

        }

        if(!params.calendarId){

            return new NextResponse("No se encontro el ID del evento", {status: 400})

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

                calendar: {
                    update: {
                        where: {
                            id: params.calendarId
                        },
                        data: {
                            title,
                            startDate,
                            endDate
                        }
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("[CALENDAR_ID_PATCH]", error);
        return new NextResponse("Internal Error", {status: 500})
        
    }

}

export async function DELETE(
    req: Request,
    {params}: {params: {calendarId: string}}
) {

    try {
        
        const profile = await currentProfile()

        const {searchParams} = new URL(req.url)

        const serverId = searchParams.get("serverId")

        if(!profile){

            return new NextResponse("Operación no permitida", {status: 401})
        
        }

        if(!serverId){

            return new NextResponse("No se encontro el ID del servidorsi soy", {status: 400})

        }

        if(!params.calendarId){

            return new NextResponse("No se encontro el ID del canal", {status: 400})

        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members:{
                    some:{
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN]
                        }
                    }
                }
            },
            data:{
                calendar: {
                    delete: {
                        id: params.calendarId
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