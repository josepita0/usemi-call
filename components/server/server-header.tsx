"use client"

import { ServerWithMembersWithProfiles } from "@/type"
import { MemberRole } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react"
import { useModal } from "@/hooks/use-modal-store"
import { useEffect, useState } from "react"
import { InfoModal } from "../modals/drawer-carousel-modal"

interface IServerHeaderProps {
    server: ServerWithMembersWithProfiles
    role?:MemberRole

}

export const ServerHeader = ({server, role}:IServerHeaderProps) => {

    const {onOpen} = useModal()

    const isAdmin = role === MemberRole.ADMIN
    const isModerator = isAdmin || role === MemberRole.MODERATOR 

    const [open, setOpen] = useState(false)

    useEffect(() => {
        const init = localStorage.getItem('firstInit') 
        console.log({init});
        

        if(!init){
            setOpen(true)
            localStorage.setItem('firstInit', 'true')
        }else{
            setOpen(false)
        }

    }, [])
    
    return (

        <>
            {/* <InfoModal
                open={open}
                setOpen={setOpen}
            /> */}

            <DropdownMenu>
                <DropdownMenuTrigger
                    className="focus:outline-none"
                    asChild
                >
                    <button 
                        id="server-header"
                        className="w-full text-md text-white font-semibold px-3 flex items-center bg-brand h-12  border-[#163273]
                        dark:border-neutral-800 border-b-2  hover:bg-brand/80 dark:hover:bg-brand/40 transition"
                    >
                        {server.name}
                        <ChevronDown className="h-5 w-5 ml-auto"/>

                    </button>

                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
                >
                    {
                        isModerator && (
                            <DropdownMenuItem
                                onClick={() => onOpen("invite", {server})}
                                className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                            >
                                Invitar integrantes
                                <UserPlus
                                    className="h-4 w-4 ml-auto"
                                />
                            </DropdownMenuItem>
                        )
                    }

                    {   
                        isAdmin && (
                            <DropdownMenuItem
                                onClick={() => onOpen("editServer", {server})}
                                className="px-3 py-2 text-sm cursor-pointer"
                            >
                                Configuración
                                <Settings
                                    className="h-4 w-4 ml-auto"
                                />
                            </DropdownMenuItem>
                        )
                    }

                    {   
                        isAdmin && (
                            <DropdownMenuItem
                                onClick={() => onOpen("members", {server})}
                                className="px-3 py-2 text-sm cursor-pointer"
                            >
                                Gestionar integrantes
                                <Users
                                    className="h-4 w-4 ml-auto"
                                />
                            </DropdownMenuItem>
                        )
                    }

                    {   
                        isModerator && (
                            <DropdownMenuItem
                                onClick={() => onOpen("createChannel", {server})}
                                className="px-3 py-2 text-sm cursor-pointer"
                            >
                                Crear canal
                                <PlusCircle
                                    className="h-4 w-4 ml-auto"
                                />
                            </DropdownMenuItem>
                        )
                    }

                    {
                        isModerator && (
                            <DropdownMenuSeparator/>
                        )
                    }


                    {
                        !isAdmin && (
                            <DropdownMenuItem
                                onClick={() => onOpen("leaveServer", {server})}
                                className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                            >
                                Abandonar servidor
                                <LogOut
                                    className="h-4 w-4 ml-auto"
                                />
                            </DropdownMenuItem>
                        )
                    }

                    {   
                        isAdmin && (
                            <DropdownMenuItem
                                onClick={() => onOpen("deleteServer", {server})}
                                className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                            >
                                Eliminar servidor
                                <Trash
                                    className="h-4 w-4 ml-auto"
                                />
                            </DropdownMenuItem>
                        )
                    }

                
                </DropdownMenuContent>
            </DropdownMenu>
        </>
        

    )
} 