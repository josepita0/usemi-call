"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store';
import { ServerWithMembersWithProfiles } from '@/type';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserAvatar } from '@/components/user-avatar';
import { MemberRole } from '@prisma/client';

import qs from "query-string";
import { Check, Gavel, Loader2, MoreHorizontal, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import axios from 'axios';
import { useRouter } from 'next-nprogress-bar';
import { showToast } from '@/lib/showToast';

const roleIconMap: Record<MemberRole, React.ReactNode | null > = {
    ADMIN: <ShieldAlert className='h-4 w-4 ml-2 text-rose-500'/>,
    MODERATOR: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500'/>,
    GUEST: null
}

export const MembersModal = () => {

    const { isOpen, onOpen, onClose, type, data } = useModal()

    const router = useRouter()

    const roleEs: Record<MemberRole, string> = {
        ADMIN: 'Administrador',
        MODERATOR: 'Moderador',
        GUEST: 'Invitado'
    }

    const arrRole:{role: MemberRole, icon: React.ReactNode | null}[] = [
        // {role: 'ADMIN',icon: null},
        {role: 'MODERATOR',icon: <ShieldCheck/>},
        {role: 'GUEST',icon: <Shield/>},

    ]

    const [isLoadingId, setIsLoadingId] = useState("")

    const isModalOpen = isOpen && type === "members";

    const { server } = data as {server: ServerWithMembersWithProfiles};


    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try {

            setIsLoadingId(memberId)

            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                    
                }
            })
            
            const response = await axios.patch(url, {role})

            showToast({
                type:'success', 
                message: 'El rol del integrante fue cambiado con éxito'
            })

            router.refresh()

            onOpen('members', {server: response.data})

        } catch (error) {
            showToast({
                type:'error', 
                message: 'El rol del integrante no pudo ser cambiado'
            })
            console.log(error);
            
        } finally {
            setIsLoadingId("")
        }
    }

    const onNewInviteCode = async () => {
        try {

         await axios.patch(`/api/servers/${server?.id}/invite-code`)

        } catch (error) {

            console.log(error);
            
        }
    }

    const onKick = async (memberId: string) => {
        try {

            setIsLoadingId(memberId)
            

            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                    
                }
            })
            
            const response = await axios.delete(url)

            showToast({
                type:'success', 
                message: 'Integrante expulsado exitosamente!'
            })

            onNewInviteCode()

            router.refresh()

            onOpen('members', {server: response.data})

        } catch (error) {

            showToast({
                type:'error', 
                message: 'El integrantes no pudo ser expulsado'
            })

            console.log(error);
            
        } finally {
            setIsLoadingId("")
        }
    }

    return (

        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black  overflow-hidden'>

                <DialogHeader className='pt-8 px-6'>

                    <DialogTitle className='text-2xl text-center font-bold'>
                        Gestión de integrantes
                    </DialogTitle>

                    <DialogDescription 
                        className='text-center text-zinc-500'
                    >
                        {server?.members?.length} {`${server?.members?.length > 1 ? "integrantes" : "integrante"}`}
                    </DialogDescription>

                </DialogHeader>

                <ScrollArea
                    className='mt-8 max-h-[420px] pr-6'
                >
                    {server?.members?.map((m) => (

                        <div key={m.id} className='flex items-center gap-x-2 mb-6'>
                            <UserAvatar 
                                src={m.profile.imageUrl}
                            />

                            <div className='flex flex-col gap-y-1'>
                                <div className='text-xs font-semibold flex items-center gap-x-1'>
                                    {m.profile.name}
                                    {roleIconMap[m.role]}
                                </div>

                            <p className='text-xs text-zinc-500'>
                                {m.profile.email}
                            </p>

                            </div>
                            {server.profileId !== m.profileId && 
                                isLoadingId !== m.id && (
                                    <div className='ml-auto'>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger>
                                                <MoreHorizontal className='w-4 h-4 text-zinc-500'/>

                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuSub>
                                                    <DropdownMenuSubTrigger
                                                        className='flex items-center'
                                                    >
                                                        <ShieldQuestion
                                                            className='w-4 h-4 mr-2'
                                                        />
                                                        <span>Rol</span>
                                                    </DropdownMenuSubTrigger>

                                                    <DropdownMenuPortal>
                                                        <DropdownMenuSubContent>
                                                            {
                                                                arrRole.map((a) => (
                                                                    <DropdownMenuItem onClick={()=> onRoleChange(m.id, a.role)} key={a.role}>
                                                                        {a.icon}
                                                                        {roleEs[a.role]}
                                                                        {m.role === a.role && (
                                                                            <Check className='h-4 w-4 ml-auto'/>
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                ))
                                                            }

                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuPortal>

                                                </DropdownMenuSub>

                                                <DropdownMenuSeparator />

                                                <DropdownMenuItem
                                                    onClick={() => onKick(m.id)}
                                                >
                                                    <Gavel className='w-4 h-4 mr-2'/>
                                                    Expulsar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>

                                        </DropdownMenu>
                                        
                                        
                                    </div>
                                )
                            }
                            {isLoadingId === m.id && (
                                <Loader2 className='animate-spin text-zinc-500 ml-auto w-4 h-4'/>
                            )}
                        </div>
                    ))}

                </ScrollArea>


            </DialogContent>
        </Dialog>

    )
}

