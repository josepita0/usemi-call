import { Channel, Member, Profile, Server } from "@prisma/client"
import { Wall } from "./chat/wall"
import { CarouselHome } from "./modals/carousel"
import { CalendarEvents } from "./calendar/calendar"
import { IAppoinments } from "@/lib/interface/appointnments"
interface HomePageProps {
    channel: any
    member: any
 }
 
export const HomeComponent = ({channel, member}: HomePageProps) => {

    const appointments:IAppoinments[] = [
        {
          id: 0,
          title: 'Website Re-Design Plan',
          startDate: new Date(2024, 0, 10, 9, 35),
          endDate: new Date(2024, 0, 10, 10, 30),
        }, 
      ];
      

    return (
        <div className="flex flex-1 flex-row h-full">
            <div className="flex  flex-col justify-start items-center py-4">

                <CarouselHome/>

                <Wall 
                    member={member}
                    channel={channel}
                />

            </div>
{/* 
            <div>
                <CalendarEvents member={member} appointments={appointments} />

            </div> */}
        </div>
    )
}

