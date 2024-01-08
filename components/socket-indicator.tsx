"use client"

import { useSocket } from "@/components/providers/socket-provider"
import { Badge } from "./ui/badge"

export const SocketIndicator = ( ) => {
    const { isConnected } = useSocket()

    if(!isConnected){

        return (
            <Badge variant={"outline"} className="bg-yellow-600 text-white border-none">
                Sin conexión, reconectando
            </Badge>
        )
    }


    return (
        <Badge variant={"outline"} className="bg-emerald-600 text-white border-none">
            Live: Cambios a tiempo real
        </Badge>
    )
}