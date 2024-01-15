import { Pencil } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { Dispatch, SetStateAction } from "react";

interface IAssistanceButton {
    className: string
}



export const DrawingButton = ({activeDrawing, onClick}:{  activeDrawing: Dispatch<SetStateAction<boolean>>, onClick?: (enabled: boolean) => void}) => {

    return (
        <ActionTooltip
            label="Pizarra"
        >
            <button 
            onClick={() => {
                activeDrawing((prev) => {
                    return !prev
                }
            )}}
            style={{alignItems: "center"}}
            // className="lk-button-group lk-button flex"
            >
            <Pencil size={20} />
            </button>
        </ActionTooltip>
    )
}