"use client"

import { useState } from 'react';
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


interface ICalendarProps {
    member: Member
    appointments: IAppoinments[]
}

interface CommandButtonProps {
    id?: 'open' | 'delete' | 'close';
    onExecute?: () => void;
  }

export const CalendarEvents = ({appointments, member}:ICalendarProps) => {

      const { data: dataCalendar } = useCalendar({apiUrl: `/api/calendar`, paramValue: member.serverId, queryKey: "serverId"})

      console.log({dataCalendar});
    
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

                if(props.id === 'delete'){

                  const { data } = editData!

                  const { startDate, title, id, endDate } = data 

                  onOpen('deleteCalendarEvent', { apiUrl: `/api/calendar/${id}`, query: {title, startDate, endDate, serverId: member.serverId } })
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
            className="flex-1 flex flex-col overflow-y-auto"
        >

        {
          dataCalendar && 
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
  
          <Toolbar />
  
          <ViewSwitcher />
              
          <DateNavigator />
          <TodayButton messages={{today: "Hoy"}} />
  
          <ConfirmationDialog />
          
          <Appointments />
  
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
        }   
        
    </div>
      );
}