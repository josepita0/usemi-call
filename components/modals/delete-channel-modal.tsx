"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import qs from "query-string"
import { useRouter } from 'next/navigation';
import { dismissToast, showToast } from '@/lib/showToast';
import { toast } from 'sonner';


export const DeleteChannelModal = () => {

    const { isOpen, onClose, type, data } = useModal()


    const router = useRouter()

    const isModalOpen = isOpen && type === "deleteChannel";

    const {server,channel} = data;

    const [ isLoading, setIsLoading ] = useState(false)


    const onClick = async () => {
        try {
            setIsLoading(true)

            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            })
            
            showToast({
                type:'loading', 
                message: 'Eliminando recurso'
            })
            
            await axios.delete(url)
            dismissToast()

            router.refresh()
            router.push(`/servers/${server?.id}`)
            onClose()
            showToast({
                type:'success', 
                message: 'Canal eliminado exitosamente!'
            })
        } catch (error) {
            showToast({
                type:'error', 
                message: 'El canal no pudo ser eliminados'
            })
            console.log(error);
            
        } finally {

            setIsLoading(false)
        }
    }

    return (

        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>

                <DialogHeader className='pt-8 px-6'>

                    <DialogTitle className='text-2xl text-center font-bold'>
                        Eliminar canal
                    </DialogTitle>

                    <DialogDescription>
                        ¿Está seguro que desea eliminar <span 
                        className='font-semibold text-indigo-500'>#{channel?.name}</span>?
                        Toda la información será eliminada permanentemente
                    </DialogDescription>

                </DialogHeader>

                <DialogFooter
                    className='bg-gray-100 px-6 py-4'
                >

                    <div
                        className='flex items-center justify-between w-full'
                    >

                    <Button
                        disabled={isLoading}
                        variant={'ghost'}
                        onClick={onClose}
                    >
                        Cancelar
                    </Button>

                    <Button
                        disabled={isLoading}
                        variant={'primary'}
                        onClick={onClick}
                    >
                        Confirmar
                    </Button>

                    </div>

                </DialogFooter>


            </DialogContent>
        </Dialog>

    )
}

