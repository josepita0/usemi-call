"use client";

import { useForm } from 'react-hook-form'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod';
import { IInitialModal, IMessageFileModal, messageFileModalSchema } from '@/lib/schemas/modals.schema';
import qs from "query-string"
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/file-upload';
import { Form, FormControl, FormItem, FormField} from '@/components/ui/form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/use-modal-store';


export const MessageFileModal = () => {

    const { isOpen,data, onClose, type } = useModal()

    const { apiUrl, query} = data

    const isModalOpen =  isOpen && type === "messageFile"

    const defaultValues = {
        fileUrl: ""
    }

    const router = useRouter()


    const form = useForm<IMessageFileModal>({defaultValues:defaultValues,resolver: zodResolver(messageFileModalSchema)})

    const handleClose = () => {
        form.reset()
        onClose()
    }

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: IMessageFileModal) => {

        try {

            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            })

            await axios.post(url, {...values, content: values.fileUrl})

            form.reset()
            router.refresh()

            handleClose()
            
        } catch (error) {

            console.log({error});
            
        }
        
    }


    return (

        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>

                <DialogHeader className='pt-8 px-6'>

                    <DialogTitle className='text-2xl text-center font-bold'>
                        Agregar soportes
                    </DialogTitle>

                    <DialogDescription className='text-center text-zinc-500'>
                        Enviar soportes/adjuntos como mensajes
                    </DialogDescription>

                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-8'>

                        <div className='space-y-8 px-6'>

                                <div className='flex items-center justify-center text-center'>
                                    
                                    <FormField
                                        control={form.control}
                                        name='fileUrl'
                                        render={ ({field}) => (
                                            <FormItem>
                                                <FormControl>
                                                    <FileUpload
                                                        endpoint="messageFile"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                </div>

                        </div>

                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                                <Button disabled={isLoading} variant={'primary'}>
                                    Enviar
                                </Button>
                        </DialogFooter>

                    </form>
                </Form>

            </DialogContent>
        </Dialog>

    )
}

