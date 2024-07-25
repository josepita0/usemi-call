"use client"

import { Plus } from "lucide-react"

import { ActionTooltip } from "@/components/action-tooltip"
import { useModal } from "@/hooks/use-modal-store"

export const NavigationAction = () => {

    const { onOpen } = useModal()

    return(
        <div id="create-server">

            <ActionTooltip
                side="right"
                align="center"
                label="Agregar un salón"
            >

            <button
                className="group flex items-center"
                onClick={() => {onOpen("createServer")}}
            >
                <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] 
                group-hover:rounded-[16px] transition-all overflow-hidden
                items-center justify-center bg-white
                group-hover:bg-white mt-4">

                    <Plus 
                        className="transtion text-[#163273]"
                        size={25}
                    />
                </div>
            </button>

            </ActionTooltip>


        </div>
    )
}