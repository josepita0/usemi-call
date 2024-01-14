"use client"

import { Member, Message, Profile } from "@prisma/client"
import { ChatWelcome } from "@/components/chat/chat-welcome"
import { useChatQuery } from "@/hooks/use-chat-query"
import { Loader2, ServerCrash } from "lucide-react"
import { ElementRef, Fragment, useRef } from "react"
import { format } from "date-fns"
import { ChatItem } from "./chat-item"
import { useChatSocket } from "@/hooks/use-chat-socket"
import { useChatScrol } from "@/hooks/use-chat-scroll"

const DATE_FORMAT = "d MMM yyyy, HH:mm"

type MessageWithMemberWithProfile = Message & {
    member: Member & {
      profile: Profile
    }
  }
interface IChatMessagesProps {
    name: string
    member: Member
    chatId: string
    apiUrl: string
    socketUrl: string
    socketQuery: Record<string, string>
    paramKey: "channelId" | "conversationsId"
    paramValue: string
    type: "channel" | "conversation"
}

export const ChatMessages = ({
    apiUrl,
    chatId, 
    member,
    name, 
    paramKey,
    paramValue,
    socketQuery,
    socketUrl,
    type
}: IChatMessagesProps) => {

    const queryKey = `chat:${chatId}`

    const addKey = `chat:${chatId}:messages`
    const updateKey = `chat:${chatId}:messages:update`

    const chatRef = useRef<ElementRef<"div">>(null)
    const bottomRef = useRef<ElementRef<"div">>(null)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
      } = useChatQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue,
      });    

      useChatSocket({ queryKey, addKey, updateKey })
      useChatScrol({chatRef, bottomRef, loadMore: fetchNextPage, shouldLoadMore: !isFetchingNextPage && !!hasNextPage, count: data?.pages?.[0]?.items?.lenght ?? 0})

    if(status === "loading") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4"/>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Cargando mensajes...
                </p>
            </div>
        )
    }

    if(status === "error") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <ServerCrash className="h-7 w-7 text-zinc-500 my-4"/>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Ocurrio un error inesperado!
                </p>
            </div>
        )
    }



    return (
        <div
            ref={chatRef}
            className="flex-1 flex flex-col py-4 overflow-y-auto"
        >

            {
                !hasNextPage && <div className="flex-1"/>
            }

            {
                !hasNextPage && (
                    <ChatWelcome
                        name={name}
                        type={type}
                    />
                )
            }

            {
                hasNextPage && (
                    <div className="flex justify-center">
                        {
                            isFetchingNextPage ? (
                                <Loader2 className="w-6 h-6 text-zinc-500 animate-spin my-4"/>
                            ) : (
                                <button
                                    onClick={() => fetchNextPage()}
                                    className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs dark:hover:text-zinc-300 transition"
                                >
                                    Cargar mensajes previos
                                </button>
                            )
                        }
                    </div>
                )
            }


            <div className="flex flex-col-reverse mt-auto">
                {data?.pages?.map((group, i) => (
                    <Fragment key={i}>
                        {group?.items.map((message: MessageWithMemberWithProfile) => (

                            <ChatItem
                                key={message.id}
                                id={message.id}
                                currentMember={member}
                                content={message.content}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                isUpdated={message.updatedAt !== message.createdAt}
                                socketUrl={socketUrl}
                                socketQuery={socketQuery}
                                member={message.member}
                            />
                        ))}
                    </Fragment>
                ))}
            </div>

            <div ref={bottomRef}/>
        </div>
    )

}