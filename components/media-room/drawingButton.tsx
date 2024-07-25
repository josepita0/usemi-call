import { Pencil } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { Dispatch, SetStateAction } from "react";

interface IAssistanceButton {
    className: string
}



export const DrawingButton = ({activeDrawing,drawing}:{  activeDrawing: Dispatch<SetStateAction<boolean>>, drawing?: boolean } ) => {

    return (
        <ActionTooltip
            label="Pizarra"
        >
            <button 
            className="lk-button-group lk-button !bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
            onClick={() => {

                drawing ? activeDrawing(false) : activeDrawing(true) 
            }}
            style={{alignItems: "center"}}
            >
            <Pencil size={20} />
            </button>
        </ActionTooltip>
    )
}