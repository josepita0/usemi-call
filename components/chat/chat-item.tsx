"use client"

import { Member, MemberRole, Profile } from "@prisma/client"
import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { IChatItem, chatItemSchema } from "@/lib/schemas/chat.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import qs from "query-string"
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { useParams, useRouter } from "next/navigation";

interface IChatItemProps {
    id: string;
    content: string;
    member: Member & {
      profile: Profile;
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
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


export const ChatItem = ({
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

    const [ isEditing, setIsEditing ] = useState(false)

    const { onOpen } = useModal()

    const defaultValues = {
        content: content
    }


    const router = useRouter()
  
    const params = useParams()

    const onMemberClick = () => {
        if(member.id === currentMember.id){
            return
        }
        
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
    }

    const form = useForm<IChatItem>({resolver: zodResolver(chatItemSchema), defaultValues})

    useEffect(() => { 

        form.reset({
            content: content
        })

    },[content])

    const fileType = fileUrl?.split(".").pop()

    const isAdmin = currentMember.role === MemberRole.ADMIN
    const isModerator = currentMember.role === MemberRole.MODERATOR
    const isOwner = currentMember.id === member.id

    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
    const canEditMessage = !deleted && isOwner && !fileUrl

    const isPDF = fileType === "pdf" && fileUrl
    const isImage = !isPDF && fileUrl

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values:IChatItem) => {
        try {

            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query:socketQuery
            })

            await axios.patch(url, values)

            form.reset()

            setIsEditing(false)
            
        } catch (error) {
            console.log(error);
            
        }
    }

    return (
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-full">
                <div
                    onClick={onMemberClick}
                    className="cursor-pointer hover:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl}/>
                </div>

                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div
                            onClick={onMemberClick} 
                            className="flex items-center">
                            <p className="font-semibold text-sm hover:underline cursor-pointer">
                                {member.profile.name}
                            </p>

                            <ActionTooltip label={roleEs[member.role]}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {
                        isImage && (
                            <a 
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                            >

                                <Image
                                    src={fileUrl}
                                    alt={content}
                                    fill
                                    className="object-cover"
                                />

                            </a>
                        )

                    }

                    {
                        isPDF && (
                            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />

                                <a 
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                                >
                                    Archivo PDF
                                </a>

                            </div>
                        )
                    }

                    {!fileUrl && !isEditing && (
                        <p className={cn(
                            "text-sm text-zinc-600 dark:text-zinc-300",
                            deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs"
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (Editado)
                                </span>
                            )}
                        </p>
                    )}

                    {!fileUrl && isEditing && (

                        <Form {...form}>
                            <form 
                                className="flex items-center w-full gap-x-2 pt-2"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({field}) =>(
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative w-full">
                                                    <Input
                                                        disabled={isLoading}
                                                        className="p-2 bg-zinc-200/90 
                                                        dark:bg-zinc-700/75 border-none border-0
                                                        focus-visible:ring-0 
                                                        focus-visible:ring-offset-0 text-zinc-600
                                                        dark:text-zinc-200"
                                                        placeholder="Editar mensaje"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    ) }
                                />

                                <Button
                                    disabled={isLoading}
                                   onClick={() => setIsEditing(false)} 
                                size={"sm"} variant={"destructive"} >
                                    Cancelar
                                </Button>

                                <Button disabled={isLoading} size={"sm"} variant={"primary"} >
                                    Guardar cambios
                                </Button>

                            </form>

                            <span className="text-[10px] mt-1 text-zinc-500 dark:text-zinc-400">
                                Seleccione 
                            </span>
                        </Form>
                    )}

                </div>
            </div>
            { canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    { canEditMessage && (
                        <ActionTooltip label="Editar">
                            <Edit 
                                onClick={ () => setIsEditing(true)}
                                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </ActionTooltip>
                    )}
                    <ActionTooltip label="Eliminar">
                        <Trash 
                            onClick={() => onOpen("deleteMessage",{ apiUrl:`${socketUrl}/${id}`, query:socketQuery })}
                            className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
        </div>
    )
}