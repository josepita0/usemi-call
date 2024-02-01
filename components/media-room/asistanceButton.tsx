import { useParticipants } from "@livekit/components-react"
import { FileDown } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { format } from "date-fns"
import { generatePDFStudents } from "@/lib/services/generatePdf.services";
import { useUser } from "@clerk/nextjs";
import { MemberRole } from "@prisma/client";


interface IAssistanceButton {
    className: string
}

interface IAssistance {
    class: string,
    date: string,
    teacher: string
}

interface IStudents {
    email: string,
    firstName: string,
    lastName: string,
    pid: string,
    role?: MemberRole,
    initClass: string
}

interface IInfo {
    dataAssistance: IAssistance 
    students: IStudents[],
}


const DATE_FORMAT = "hh:mm:ss aaaaa'm'"


export const AssistanceButton = ({
    className
}: IAssistanceButton) => {

    const { user } = useUser();
    const participants = useParticipants()

    const participantsMapped = participants.map((p) => {

        if (p.metadata){
            const data = JSON.parse(p.metadata as string)
    
            const initClass = format(new Date(p.joinedAt as Date), DATE_FORMAT)        
    
            const obj:IStudents = {
                ...data,
                initClass            
            }
    
            return obj

        } else {

            const metadata = {
                firstName: user?.firstName ? user?.firstName : "N/A",
                lastName: user?.lastName ? user?.lastName : "N/A",
                pid: user?.unsafeMetadata?.pid ? user?.unsafeMetadata?.pid as string : "N/A",
                email: user?.primaryEmailAddress?.emailAddress ? user?.primaryEmailAddress?.emailAddress : "N/A"
            }

            const initClass = format(new Date(p.joinedAt as Date), DATE_FORMAT)        
    
            const obj:IStudents = {
                ...metadata,
                initClass            
            }
    
            return obj
        }
    })

    const onClick = async (values: IStudents[]) => {

        const sortedValues = values.sort((a, b) => {
            const lastNameComparison = a.lastName.localeCompare(b.lastName);
            return lastNameComparison !== 0 ? lastNameComparison : a.firstName.localeCompare(b.firstName);
        });
        
        const teacherData = sortedValues.find( s => s.role === MemberRole.ADMIN)

        const info: IInfo = {
            students:sortedValues.filter( s => s.role !== MemberRole.ADMIN),
            dataAssistance: {
                date: format(new Date(), "dd/MM/yyyy hh:mm aaaaa'm'"),
                class: className,
                teacher: `${teacherData?.lastName}, ${teacherData?.firstName} `
            }
        }

        generatePDFStudents(info)

    }


    return (
        <ActionTooltip
            label="Tomar asistencia"
        >
            <button 
            onClick={() => onClick(participantsMapped)}
            style={{alignItems: "center"}}
            className="lk-button-group lk-button flex"
            >
            <FileDown size={20} />
            </button>
        </ActionTooltip>
    )
}