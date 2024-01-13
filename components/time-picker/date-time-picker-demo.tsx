"use client";
 
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerDemo } from "./time-picker-demo";
import { FormLabel } from "../ui/form";
import { UseFormReturn } from "react-hook-form";
import { es } from 'date-fns/locale';

interface IState {
    startDate?: Date | undefined;
    endDate?: Date;
} 

interface IDateTimePickerDemoProps {
    id:string,
    label: string, 
    setState: Dispatch<SetStateAction<any>>, 
    initDate?:  any
}

 
export function DateTimePickerDemo({ id, label, setState, initDate}:IDateTimePickerDemoProps) {
  const [date, setDate] = useState<Date>();

    useEffect(()=> {

        if(initDate){
            setDate(initDate)
        }

    }, [initDate])
 
    useEffect(() => {

        if(date){
            
            setState((prev: IState) => {
                
                if(id === 'startDate'){

                    const { startDate, ...newData } = prev 

                    return {...newData, startDate: date}
                }

                if(id === 'endDate'){

                    const { endDate, ...newData } = prev as {
                        startDate?: Date | undefined;
                        endDate?: Date;
                    } 

                    return {...newData, endDate: date}
                }


            })
            
        }

    }, [date])

  return (
    <div className="flex flex-col w-full ">

        <FormLabel
            className='uppercase text-sm font-bold text-zinc-500 dark:text-secondary/70'
        >
            {label}
        </FormLabel>

        <Popover>
        <PopoverTrigger asChild>
                <Button
            variant={"outline"}
            className={cn(
                "w-full justify-start text-left font-normal whitespace-nowrap",
                !date && "text-muted-foreground"
            )}
            style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
            }}
            >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="truncate">{date
                ? format(date, "PPP HH:mm", { locale: es })
                : "Selecciona una fecha"}</span>
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
            <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            />
            <div className="p-3 border-t border-border">
            <TimePickerDemo setDate={setDate} date={date} />
            </div>
        </PopoverContent>
        </Popover>
    </div>
    
  );
}