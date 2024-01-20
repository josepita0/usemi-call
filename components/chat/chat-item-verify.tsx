"use client"

import { Member, MemberRole, Profile } from "@prisma/client"
import { UserAvatar } from "@/components/user-avatar";
import { Circle, ShieldAlert, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { IChatItem, chatItemSchema } from "@/lib/schemas/chat.schema";
import { zodResolver } from "@hookform/resolvers/zod";


interface IChatItemProps {
    id: string;
    content: string;
    member?: Member & {
      profile: Profile;
    };
    timestamp?: string;
    fileUrl?: string | null;
    deleted?: boolean;
    currentMember?: Member;
    isUpdated?: boolean;
    socketUrl?: string;
    socketQuery?: Record<string, string>;
  };

const roleIconMap: Record<MemberRole, React.ReactNode | null > = {
    ADMIN: <ShieldAlert className='h-4 w-4 ml-2 text-rose-500'/>,
    MODERATOR: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500'/>,
    GUEST: null
}

const roleEs: Record<MemberRole, string> = {
    ADMIN: 'Administrador',
    MODERATOR: 'Moderador',
    GUEST: 'Invitado'
}


export const ChatItemVerify = ({
    content,
    currentMember,
    deleted,
    fileUrl,
    id,
    isUpdated, 
    member,
    socketQuery,
    socketUrl,
    timestamp
}:IChatItemProps) => {

    const defaultValues = {
        content: content
    }

    const form = useForm<IChatItem>({resolver: zodResolver(chatItemSchema), defaultValues})

    useEffect(() => { 

        form.reset({
            content: content
        })

    },[content])

    return (
        <div className="relative ">

            <Circle fill="#fdba74" className={cn("absolute top-0 left-0 text-orange-300 animate-ping opacity-75 z-50")}/>
            <Circle fill="#fdba74" className={cn("absolute top-0 left-0 text-orange-300 z-50")}/> 

            <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full ">
                <div className="group flex gap-x-2 items-start w-full">
                    <div>
                        <UserAvatar src={member?.profile.imageUrl}/>
                    </div>

                    <div className="flex flex-col w-full">
                        <div className="flex items-center gap-x-2">
                            <div
                                className="flex items-center">
                                <p className="font-semibold text-sm">
                                    {member?.profile.name} 
                                </p>

                            </div>
        
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                {timestamp}
                            </span>
                        </div>

                            <p className={cn(
                                "text-sm text-zinc-600 dark:text-zinc-300",
                                deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs"
                            )}>
                                {content}
                            </p>

                            <div
                                className="flex items-center">
                                <p className="font-semibold text-xs italic text-orange-400">
                                    El mensaje está siendo verificado 
                                </p>

                            </div>

                    </div>
                </div>

            </div>

        </div>
    )
}