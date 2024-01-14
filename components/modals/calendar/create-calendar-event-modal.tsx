"use client";

import { useForm } from 'react-hook-form'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod';
import { ICalendarEventModal, IChannelModal, calendarEventModalSchema, channelModalSchema,  } from '@/lib/schemas/modals.schema';
import qs from "query-string";

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormLabel, FormItem, FormField, FormMessage} from '@/components/ui/form'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { ChannelType } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { DateTimePickerDemo } from '@/components/time-picker/date-time-picker-demo';
import { dismissToast, showToast } from '@/lib/showToast';


export const CreateCalendarEventModal = () => {
    

    
    const router = useRouter()
    const params = useParams()
    
    const { isOpen, onClose, type, data } = useModal()

    const [ dates, setDates ] = useState<{startDate?:Date | null, endDate?: Date | null }>({endDate: null, startDate: null})
    
    const { channelType } = data
    
    const isModalOpen = isOpen && type === "createCalendarEvent";
    
    const defaultValues = {
        title: "",
        startDate: null,
        endDate: null
    }


    const form = useForm({defaultValues:defaultValues,resolver: zodResolver(calendarEventModalSchema)})

    useEffect(() => {

        if(dates){

            form.setValue('startDate',dates?.startDate as null)

            form.setValue('endDate',dates?.endDate as null)        
            
        }

    }, [dates])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values:any) => {        

        try {

            const url = qs.stringifyUrl({
                url: "/api/calendar",
                query: {
                    serverId: params?.serverId
                }
            })

            showToast({
                type:'loading', 
                message: 'Creando evento'
            })


            await axios.post(url, values)

            dismissToast()

            showToast({
                type:'success', 
                message: 'Evento creado exitosamente!'
            })


            form.reset()
            router.refresh()
            onClose();
            
        } catch (error) {

            showToast({
                type:'success', 
                message: 'El evento no pudo ser creado'
            })

            console.log({error});
            
        }

    }

    const handleClose = () => {
        form.reset()
        onClose()
    }


    return (

        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>

                <DialogHeader className='pt-8 px-6'>

                    <DialogTitle className='text-2xl text-center font-bold'>
                        Crear evento
                    </DialogTitle>

                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8'>

                        <div className='space-y-8 px-6'>

                                <FormField 
                                    control={form.control}
                                    name='title'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className='uppercase text-sm font-bold text-zinc-500 dark:text-secondary/70'
                                            >
                                                Titulo del evento
                                            </FormLabel>

                                            <FormControl>
                                                <Input 
                                                    disabled={isLoading}
                                                    className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                                    placeholder='Ingrese el titulo'
                                                    {...field}
                                                /> 
                                            </FormControl>
                                            <FormMessage />

                                        </FormItem>
                                    )}
                                />

                                <div className='flex md:flex-row flex-col w-full gap-2 '>

                                    <DateTimePickerDemo 
                                        id='startDate'
                                        setState={setDates}
                                        label='Fecha de inicio'
                                    />

                                    <DateTimePickerDemo
                                        id='endDate'
                                        setState={setDates}
                                        label='Fecha final'
                                    />
                                </div>




                        </div>

                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                                <Button disabled={isLoading} variant={'primary'}>
                                    Crear
                                </Button>
                        </DialogFooter>

                    </form>
                </Form>

            </DialogContent>
        </Dialog>

    )
}

