import { Channel, Member, Profile, Server } from "@prisma/client"
import { Wall } from "./chat/wall"
import { CarouselHome } from "./modals/carousel"
import { CalendarEvents } from "./calendar/calendar"
import { IAppoinments } from "@/lib/interface/appointnments"
import { Label } from "./ui/label"
interface HomePageProps {
    channel: any
    member: any,
    members: any
 }
 
export const HomeComponent = ({channel, member, members}: HomePageProps) => {


      

    return (
        <div className="flex flex-1 flex-row h-full">
            <div className="flex  sm:flex-row-reverse flex-col justify-start items-center p-4 gap-6">

                <CarouselHome/>

                <div className="flex flex-col py-6 h-full gap-4">

                    <Label
                        className='text-xl text-zinc-500 dark:text-white'
                    >
                        Muro de notificaciones
                    </Label>
                    <Wall 
                        member={member}
                        channel={channel}
                        members={members}
                    />
                </div>

            </div>
{/* 
            <div>
                <CalendarEvents member={member} appointments={appointments} />

            </div> */}
        </div>
    )
}

