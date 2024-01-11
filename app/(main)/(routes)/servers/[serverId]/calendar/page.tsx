import { CalendarEvents } from "@/components/calendar/calendar";
import { ChatHeader } from "@/components/chat/chat-header";
import { useCalendar } from "@/hooks/use-calendar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { IAppoinments } from "@/lib/interface/appointnments";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface IChannelIdPage {
    params: {
        serverId: string
        channelId: string
    }
}

const CalendarPage = async ({params}:IChannelIdPage) => {

    

    const appointments:IAppoinments[] = [
        {
          id: 0,
          title: 'Website Re-Design Plan',
          startDate: new Date(2024, 0, 10, 9, 35),
          endDate: new Date(2024, 0, 10, 10, 30),
        }, 
      ];
      
      

      const profile = await currentProfile()

      if(!profile){
          return redirectToSignIn()
      }
  
      const member = await db.member.findFirst({
          where:{
              serverId: params.serverId,
              profileId: profile.id
          },
          include:{
            server: {
                include: {
                    calendar: true                    
                }
            }
          }
      })
   
      
      
      console.log({member: member?.server.calendar});
      if(!member){
          redirect(`/`)
      }

    

    return ( 
        <div className="bg-white dark:bg-[#313338] flex flex-col justify-between h-full">
             <ChatHeader
                name={"Calendario"}
                serverId={params.serverId}
                type="channel"
            />
            <CalendarEvents member={member} appointments={appointments} ></CalendarEvents>
        </div>
     );
}
 
export default CalendarPage;