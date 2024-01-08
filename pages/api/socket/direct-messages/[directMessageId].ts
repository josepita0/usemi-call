import { NextApiRequest } from "next";
import { MemberRole } from "@prisma/client";

import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/type";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({error: "Metodo no permitido"})
}

  try {
    const profile = await currentProfilePages(req);
    const { directMessageId, conversationsId } = req.query;
    const { content } = req.body;

    if (!profile) {
        return res.status(401).json({ error: "Operación no permitida" })
    }

    if (!conversationsId) {
        return res.status(400).json({ error: "No se encontro el ID de la conversación" })
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationsId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            }
          },
          {
            memberTwp: {
              profileId: profile.id,
            }
          }
        ]
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          }
        },
        memberTwp: {
          include: {
            profile: true,
          }
        }
      }
    })

    if (!conversation) {
        return res.status(401).json({ error: "No se encontro la conversación" })
    }

    const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwp;

    if (!member) {
        return res.status(401).json({ error: "No se encontro el integrante" })
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationsId: conversationsId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          }
        }
      }
    })

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
        return res.status(401).json({ error: "Operación no permitida" })
    }

    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: "Este mensaje fue eliminado",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        }
      })
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Operación no permitida" })
    }

      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        }
      })
    }

    const updateKey = `chat:${conversation.id}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}