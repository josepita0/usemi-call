"use client"

import { useEffect, useState } from 'react';
import {
  Scheduler,
  WeekView,
  Appointments,
  Toolbar,
  ViewSwitcher,
  MonthView,
  TodayButton,
  DateNavigator,
  AppointmentTooltip,
  ConfirmationDialog,

} from '@devexpress/dx-react-scheduler-material-ui';
import { AppointmentMeta, EditingState, ViewState } from '@devexpress/dx-react-scheduler';
import { Edit, Trash, X } from "lucide-react";


import { Button } from "@/components/ui/button";
import { IAppoinments } from '@/lib/interface/appointnments';
import { Member, Profile } from '@prisma/client';
import { useCalendar } from '@/hooks/use-calendar';
import { db } from '@/lib/db';
import { useModal } from '@/hooks/use-modal-store';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from 'next/image';

import dummy1 from "@/public/Comparte Ideas.png";
import dummy2 from "@/public/Ver Clase.png";
import dumm3 from "@/public/Organizate.png";

interface ICalendarProps {
    member: Member
    appointments: IAppoinments[]
}

interface CommandButtonProps {
    id?: 'open' | 'delete' | 'close';
    onExecute?: () => void;
  }

export const CalendarEvents = ({appointments, member}:ICalendarProps) => {

      const { data: dataCalendar } = useCalendar({apiUrl: `/api/calendar/`, paramValue: member.serverId, queryKey: "serverId"})
    
      const { onOpen } = useModal()

      const [ isVisible, setIsVisible ] = useState(false)      

      const [data, setData] = useState(appointments);
      const [editData, setEditData] = useState<AppointmentMeta>();
      const [currentDate, setCurrentDate] = useState<Date>();
      const [addedAppointment, setAddedAppointment] = useState({});
      const [appointmentChanges, setAppointmentChanges] = useState({});
      const [editingAppointment, setEditingAppointment] = useState(undefined);
    
      const changeAddedAppointment = (newAddedAppointment:any) => {
        console.log("holaaaa");
        setAddedAppointment(newAddedAppointment);
      };
    
      const changeAppointmentChanges = (newAppointmentChanges:any) => {
        console.log("hol2");
    
        setAppointmentChanges(newAppointmentChanges);
      };
    
      const changeEditingAppointment = (newEditingAppointment:any) => {
        console.log("hola");
        
        setEditingAppointment(newEditingAppointment);
      };
    
      const commitChanges = ({ added, changed, deleted }:any) => {
        setData((prevData) => {
          let newData = [...prevData];
          if (added) {
            const startingAddedId = newData.length > 0 ? newData[newData.length - 1].id + 1 : 0;
            newData = [...newData, { id: startingAddedId, ...added }];
          }
          if (changed) {
            newData = newData.map((appointment) =>
              changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment
            );
          }
          if (deleted !== undefined) {
            newData = newData.filter((appointment) => appointment.id !== deleted);
          }
    
          console.log({prevData});
          
          return newData;
        });
      };
    
    
      const isAdmin = member.role === 'ADMIN';
      const isModerator = member.role === "MODERATOR"
      const isGuest = member.role === "GUEST"

      const myAppointment = (props: CommandButtonProps)=> {
        
            const onClick = () => {

              console.log({props});
              
                setIsVisible(false)

                props.onExecute && props.onExecute()

                if(props.id === 'open'){

                  const { data } = editData!
  
                  const { startDate, title, id, endDate } = data 
  
                  onOpen('editCalendarEvent', { apiUrl: `/api/calendar/${id}`, calendar: editData, query: {title, startDate, endDate, serverId: member.serverId } })

                }

                if(props.id === 'delete'){

                  const { data } = editData!
  
                  const { startDate, title, id, endDate } = data 
  
                  onOpen('deleteCalendarEvent', { apiUrl: `/api/calendar/${id}` ,query: {title, startDate, endDate, serverId: member.serverId, calendarId: id} })
                  
                } 
            }
                        
            return (
                <button
                onClick={onClick}
              >
                {
                  props.id === "close"
                      ? <X className="text-zinc-500 my-3" size={24} /> 
                  : props.id === "open"
                      ? <Edit className="text-zinc-500 my-3 mx-3" size={24} />
                  :  <Trash className="text-zinc-500 my-3 " size={24} />
      
                }
              </button>
            );
        



      }



    return (
      
        <div
            className="flex flex-row overflow-y-auto"
        >

          <div className="p-4 pb-0 bg-zinc-300/80 rounded-md flex  ">
            <Carousel
                        opts={{
                            align: "start",
                        }}
                        orientation="horizontal"
                        className="w-full"
                >
                <CarouselContent>
                    <CarouselItem>

                        <Image
                            src={dummy1}
                            alt='dumycito'
                        />

                    </CarouselItem>
                    <CarouselItem>  <Image
                            src={dummy2}
                            alt='dumycito'
                        /></CarouselItem>
                    <CarouselItem>  <Image
                            src={dumm3}
                            alt='dumycito'
                        /></CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
                </Carousel>
          </div>

        {
          dataCalendar && (
            <Scheduler 

              locale={"es"}
              data={(dataCalendar as {serverId:string, id:string,endDate:string, startDate:string, title:string}[])?.map((d,i)=>{

                const { serverId,  startDate, endDate, id, title } = d

                const obj = {title: title, id ,startDate: new Date(startDate), endDate: new Date(endDate)}
                
                return obj
              })} 
              height={'auto'}  >
                
                <ViewState
                  currentDate={currentDate}
                  onCurrentDateChange={(c)=>{
                    setCurrentDate(c)
                  }}
                  defaultCurrentViewName="Week"
                />
            
              <EditingState
                onCommitChanges={commitChanges}
                addedAppointment={addedAppointment}
                onAddedAppointmentChange={changeAddedAppointment}
                appointmentChanges={appointmentChanges}
                onAppointmentChangesChange={changeAppointmentChanges}
                editingAppointment={editingAppointment}
                onEditingAppointmentChange={changeEditingAppointment}
              />
      
              <WeekView 
                startDayHour={7} 
                endDayHour={20} 
                displayName="Semana" />
      
              <MonthView  
                displayName="Mes"
                name="Mes"
              />
      
              <Appointments />
              <Toolbar />
      
              <ViewSwitcher />
                  
              <DateNavigator />
              <TodayButton messages={{today: "Hoy"}} />
      
              <ConfirmationDialog />
              
      
              <AppointmentTooltip  
                showDeleteButton={ isAdmin }
                showOpenButton={ isAdmin || isModerator }
                showCloseButton={ isAdmin || isModerator || isGuest }
      
                commandButtonComponent={myAppointment}



                visible={isVisible}

                onAppointmentMetaChange={(d)=>{
                  setIsVisible(true)
                  setEditData(d)
                }}  
              />
      
            </Scheduler>
          ) 
        }
        
    </div>
      );
}