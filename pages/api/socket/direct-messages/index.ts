import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";
import { NextApiRequest } from "next";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {
    
    if(req.method !== "POST"){
        return res.status(405).json({error: "Metodo no permitido"})

    }

    try {

        const profile = await currentProfilePages(req)

        const { content, fileUrl } = req.body
        
        const { conversationsId } = req.query

        if(!profile){
            return res.status(401).json({ error: "Operación no permitida" })
        }

        if(!conversationsId){
            return res.status(400).json({ error: "No se encontro el ID de la conversación" })
        }

        if(!content){
            return res.status(401).json({ error: "No se encontro el contenido del mensaje" })
        }
        

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationsId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id
                        }
                    },
                    {
                        memberTwp: {
                            profileId: profile.id
                        }
                    },
                ]
            },
            include:{
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwp: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        if(!conversation){
            return res.status(400).json({ error: "No se encontro la conversación" })
        }


        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwp

        if(!member){
            return res.status(401).json({ error: "No se encontro el integrante" })
        }


        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationsId: conversationsId as string,
                memberId: member.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        const channelKey = `chat:${conversationsId}:messages`

        res?.socket?.server?.io?.emit(channelKey, message)

        return res.status(200).json(message)
        

    } catch (error) {
        console.log("[DIRECT_MESSAGE_POST]", error);
        return res.status(500).json({error: "Internal Error"})

    }
}