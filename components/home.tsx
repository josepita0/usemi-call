import { Channel, Member, Profile, Server } from "@prisma/client"
import { Wall } from "./chat/wall"
import { CarouselHome } from "./modals/carousel"
import { CalendarEvents } from "./calendar/calendar"
import { IAppoinments } from "@/lib/interface/appointnments"
interface HomePageProps {
    channel: any
    member: any,
    members: any
 }
 
export const HomeComponent = ({channel, member, members}: HomePageProps) => {


      

    return (
        <div className="flex flex-1 flex-row h-full">
            <div className="flex  flex-col justify-start items-center py-4">

                <CarouselHome/>

                <Wall 
                    member={member}
                    channel={channel}
                    members={members}
                />

            </div>
{/* 
            <div>
                <CalendarEvents member={member} appointments={appointments} />

            </div> */}
        </div>
    )
}

