"use client";

import { useForm } from 'react-hook-form'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod';
import { IInitialModal, initialModalSchema } from '@/lib/schemas/modals.schema';

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload';
import { Form, FormControl, FormLabel, FormItem, FormField, FormMessage} from '@/components/ui/form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';
import { useEffect } from 'react';
import { dismissToast, showToast } from '@/lib/showToast';


export const EditServerModal = () => {

    const defaultValues = {
        name: "",
        imageUrl: ""
    }

    const router = useRouter()

    const { isOpen, onClose, type, data } = useModal()

    const isModalOpen = isOpen && type === "editServer";

    const {server} = data


    const form = useForm({defaultValues:defaultValues,resolver: zodResolver(initialModalSchema)})

    useEffect(() => {
        if(server){
            form.setValue("name", server.name)
            form.setValue("imageUrl", server.imageUrl)
        }
    },[server, form])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: IInitialModal) => {

        try {

            showToast({
                type:'loading', 
                message: 'Actualizando recurso'
            })

            await axios.patch(`/api/servers/${server?.id}`, values)

            dismissToast()

            form.reset()
            router.refresh()
            onClose();

            showToast({
                type:'success', 
                message: 'Servidor actualizado exitosamente!'
            })
            
        } catch (error) {

            showToast({
                type:'error', 
                message: 'El servidor no pudo ser actualizado'
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
                        Actualizar servidor
                    </DialogTitle>

                    <DialogDescription className='text-center text-zinc-500'>
                        Personalizar el servidor con los datos de preferencia, por favor agregar una imagen y nombre
                    </DialogDescription>

                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8'>

                        <div className='space-y-8 px-6'>

                                <div className='flex items-center justify-center text-center'>
                                    
                                    <FormField
                                        control={form.control}
                                        name='imageUrl'
                                        render={ ({field}) => (
                                            <FormItem>
                                                <FormControl>
                                                    <FileUpload
                                                        endpoint="serverImage"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                </div>

                                <FormField 
                                    control={form.control}
                                    name='name'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className='uppercase text-sm font-bold text-zinc-500 dark:text-secondary/70'
                                            >
                                                Nombre del servidor 
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

