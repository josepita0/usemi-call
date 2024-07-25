import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { Calendar, MemberRole, Server } from "@prisma/client"
import { NextResponse } from "next/server"

export async function POST(req: Request) {

    try {
        
        const profile = await currentProfile()

        const { startDate, endDate, title } = await req.json()

        const { searchParams } = new URL(req.url)

        const serverId = searchParams.get("serverId")

        if(!profile){

            return new NextResponse("Operación no permitida", {status: 401})
        
        }
        
        if(!serverId){

            return new NextResponse("No se encontro el ID del salón", {status: 400})

        }

        const server = await db.server.update({

            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN]
                        }
                    }
                }
            },
            data: {
                calendar: {
                    create: {
                        title,
                        startDate,
                        endDate,
                    }
                }
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("[CALENDAR_POST]", error);
        return new NextResponse("Internal Error", {status:500})
    }
    
}

export async function GET(
    req: Request
  ) {
    try {
      const profile = await currentProfile();

      const { searchParams } = new URL(req.url);

      const serverId = searchParams.get("serverId")
  
      if (!profile) {
          return new NextResponse("Operación no permitida", { status: 401 });
      }


    if(!serverId){

        return new NextResponse("No se encontro el ID del salón", {status: 400})

    }

    let calendar: Calendar[]
    

    calendar = await db.calendar.findMany({
        take: 100,
        where: {
            serverId: serverId,
        },
    })
      
   
    return NextResponse.json(calendar)

    } catch (error) {
      console.log("[CALENDAR_GET]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }