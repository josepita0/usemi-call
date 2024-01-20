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
            onClick={() => {

                drawing ? activeDrawing(false) : activeDrawing(true) 
            }}
            style={{alignItems: "center"}}
            // className="lk-button-group lk-button flex"
            >
            <Pencil size={20} />
            </button>
        </ActionTooltip>
    )
}