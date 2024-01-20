"use client";

import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react';
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod';
import { IInitialModal, initialModalSchema } from '@/lib/schemas/modals.schema';

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload';
import { Form, FormControl, FormLabel, FormItem, FormField, FormMessage} from '@/components/ui/form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next-nprogress-bar';


export const InitialModal = () => {

    const defaultValues = {
        name: "",
        imageUrl: ""
    }

    const router = useRouter()

    const [ isMounted, setIsMounted ] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])


    const form = useForm({defaultValues:defaultValues,resolver: zodResolver(initialModalSchema)})

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: IInitialModal) => {

        try {

            await axios.post("/api/servers", values)

            form.reset()
            router.refresh()
            window.location.reload()
            
        } catch (error) {

            console.log({error});
            
        }
        
    }

    if(!isMounted){

        return null;

    }

    return (

        <Dialog open>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>

                <DialogHeader className='pt-8 px-6'>

                    <DialogTitle className='text-2xl text-center font-bold'>
                        Personalizar servidor
                    </DialogTitle>

                    <DialogDescription className='text-center text-zinc-500'>
                        Personalizar tu servidor con la imagen que prefieras
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
                                    Crear
                                </Button>
                        </DialogFooter>

                    </form>
                </Form>

            </DialogContent>
        </Dialog>

    )
}

