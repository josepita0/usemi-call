"use client"

import { ServerWithMembersWithProfiles } from "@/type"
import { MemberRole } from "@prisma/client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react"
import { useModal } from "@/hooks/use-modal-store"
import { useEffect, useState } from "react"
import { InfoModal } from "../modals/drawer-carousel-modal"
import { Config, driver } from "driver.js"

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

        if(!init){
            setOpen(true)
            localStorage.setItem('firstInit', 'true')

            let config: Config = {
                doneBtnText: "Finalizar",
                smoothScroll: true,
                showButtons: [
                    "close"
                ],
                steps: [
                    { 
                        element: '#help-button',
                        popover: { 
                            title: 'Ayuda', 
                            description: 'Si necesitas ayuda, acá podrás ver nuestras funciones!', 
                            side: "left", 
                            align: 'start',
                            popoverClass: 'my-custom-popover-class',
                            
                        },
        
                    },
        
                ]
              }
            
            let driverObj2 = driver(config);
            

            setTimeout(() => {
                driverObj2.drive()
    
                config = {
                    doneBtnText: "Finalizar",
                    prevBtnText: "Anterior",
                    nextBtnText: "Siguiente",
                    smoothScroll: true,
            
                    steps:  [
                        { 
                            element: '#create-server',
                            popover: { 
                                title: 'Crear salón', 
                                description: 'Aquí puedes crear tus salones, para ver tus clases!', 
                                side: "left", 
                                align: 'start',
                                popoverClass: 'my-custom-popover-class',
                                
                            },
            
                        },
                        { 
                            element: '#server-header',
                            popover: { 
                                title: 'Gestionar salón', 
                                description: 'Podras actualizar y gestionar tu salón como prefieras!', 
                                side: "left", 
                                align: 'start',
                                popoverClass: 'my-custom-popover-class',
                                
                            },
            
                        },
                        { 
                            element: '#home-btn',
                            popover: { 
                                title: 'Inicio', 
                                description: 'Acá el profesor podrá dejar comentarios y documentos para que sea lo primero a ver!', 
                                side: "left", 
                                align: 'start',
                                popoverClass: 'my-custom-popover-class',
                                
                            },
            
                        },
                        { 
                            element: '#calendar-btn',
                            popover: { 
                                title: 'Calendario', 
                                description: 'Organiza tus eventos como mejor prefieras!', 
                                side: "left", 
                                align: 'start',
                                popoverClass: 'my-custom-popover-class',
                                
                            },
            
                        },
                        { 
                            element: '#channels-text',
                            popover: { 
                                title: 'Canales', 
                                description: 'Aquí estarán tus canales, donde podrás hablar con los integrantes del salón!', 
                                side: "left", 
                                align: 'start',
                                popoverClass: 'my-custom-popover-class',
                                
                            },
            
                        },
                        { 
                            element: '#mode-toggle',
                            popover: { 
                                title: 'Oscuro o claro?', 
                                description: 'Podrás cambiar tu modo para que se vea mejor!', 
                                side: "left", 
                                align: 'start',
                                popoverClass: 'my-custom-popover-class',
                                
                            },
            
                        },
                    ]
                }
    
                driverObj2 = driver(config)
            }, 3500);

            
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
                                Abandonar salón
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
                                Eliminar salón
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