import { Radio } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { Member, MemberRole, Profile } from "@prisma/client";
import qs from 'query-string'
import axios from "axios";
import { showToast } from "@/lib/showToast";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface IInitButton {
    className: string
    channelName: string
    members: any
}


export const InitClassButton = ({
    className,
    channelName,
    members
}: IInitButton) => {

    const [initClass, setInitClass] = useState(false)

    const onClick = async () => {

            

            const adminData = members.find((m:Member & {profile: Profile}) => m.role === MemberRole.ADMIN)

    
            members?.forEach((m: Member & {profile: Profile}) => {

                const text = !initClass ? `Corre🫨! El profesor *${adminData.profile.name}* de la catedra *${className}*, acaba de comenzar clases en el canal *${channelName}*` : `Listo🫡! El profesor *${adminData.profile.name}* de la catedra *${className}*, culminó su clase en el canal *${channelName}*`

            if(m.role !== MemberRole.ADMIN){
                const data = qs.stringify({
                "token": "ouamzdthgipmh4ce",
                "to": m.profile.phoneNumber,
                "body": text
                });
            
                const config = {
                method: 'post',
                url: 'https://api.ultramsg.com/instance76759/messages/chat',
                headers: {  
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : data
                };
        
                axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    showToast({
                        type: "error",
                        message: "La notificación no pudo ser enviada"
                    })
                    console.log(error);
                });
                } 
                
            })
            showToast({
                type: "success",
                message: "La notificación fue enviada a todos los integrantes exitosamente!"
            })

    }


    return (
        <ActionTooltip
            label={!initClass ? "Iniciar clase" : "Finalizar clase"}
        >
            <button 
            onClick={() => {
                if(!initClass){
                    setInitClass(true)
                }else{
                    setInitClass(false)
                }
                onClick()
            }}
            style={{alignItems: "center"}}
            className="lk-button-group lk-button flex relative !bg-green-700"
            >
            {
                initClass && 
                <Radio className={cn(initClass && 'absolute text-white')} size={20} />
            }
            <Radio className={cn(initClass && 'animate-ping text-white')} size={20} />
            </button>
        </ActionTooltip>
    )
}