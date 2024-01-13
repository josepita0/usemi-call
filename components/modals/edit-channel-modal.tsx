"use client";

import { useForm } from 'react-hook-form'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod';
import { IChannelModal, channelModalSchema,  } from '@/lib/schemas/modals.schema';
import qs from "query-string";

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormLabel, FormItem, FormField, FormMessage} from '@/components/ui/form'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useParams, useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { ChannelType } from '@prisma/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useEffect } from 'react';


export const EditChannelModal = () => {
    
    const typeChannelEs: Record<ChannelType, string> = {
        TEXT: 'Texto',
        AUDIO: 'Audio',
        VIDEO: 'Video',
        CALENDAR: 'Calendario'
    }
    
    
    const router = useRouter()
    
    const { isOpen, onClose, type, data } = useModal()
    
    const { channel, server } = data
    
    const isModalOpen = isOpen && type === "editChannel";
    
    const defaultValues = {
        name: "",
        type: channel?.type || ChannelType.TEXT,
    }


    const form = useForm({defaultValues:defaultValues,resolver: zodResolver(channelModalSchema)})

    useEffect(() => {

        
      if(channel){
        form.setValue("name", channel.name)
        form.setValue("type", channel.type)
      }

    }, [form, channel])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: IChannelModal) => {

        try {

            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })

            await axios.patch(url, values)

            form.reset()
            router.refresh()
            onClose();
            
        } catch (error) {

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
                        Editar canal
                    </DialogTitle>

                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8'>

                        <div className='space-y-8 px-6'>

                                <FormField 
                                    control={form.control}
                                    name='name'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className='uppercase text-sm font-bold text-zinc-500 dark:text-secondary/70'
                                            >
                                                Nombre del canal 
                                            </FormLabel>

                                            <FormControl>
                                                <Input 
                                                    disabled={isLoading}
                                                    className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                                    placeholder='Ingrese el nombre'
                                                    {...field}
                                                /> 
                                            </FormControl>
                                            <FormMessage />

                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control}
                                    name='type'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className='uppercase text-sm font-bold text-zinc-500 dark:text-secondary/70'
                                            >
                                                Tipo de canal 
                                            </FormLabel>

                                            <Select
                                                disabled={isLoading}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >

                                                <FormControl>

                                                    <SelectTrigger
                                                        className='bg-zinc-300/50 border-0
                                                        focus:ring-0 text-black ring-offset-0
                                                        focus:ring-offset-0 outline-none' 
                                                    >

                                                        <SelectValue className='text-zinc-500' placeholder="Seleccione un tipo de canal"/>

                                                    </SelectTrigger>

                                                </FormControl>

                                                <SelectContent>
                                                    {
                                                        Object.values(ChannelType).map((type) => {

                                                            if(type !== "CALENDAR"){
                                                                return    <SelectItem
                                                                    key={typeChannelEs[type]}
                                                                    value={type}
                                                                    className='capitalize'
                                                                >
                                                                    {typeChannelEs[type]}
                                                                </SelectItem>

                                                            }

                                                        })

                                                    }
                                                </SelectContent>

                                            </Select>

                                            <FormMessage />

                                        </FormItem>
                                    )}
                                />
                        </div>

                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                                <Button disabled={isLoading} variant={'primary'}>
                                    Guardar cambios
                                </Button>
                        </DialogFooter>

                    </form>
                </Form>

            </DialogContent>
        </Dialog>

    )
}

