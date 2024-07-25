"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next-nprogress-bar';
import { dismissToast, showToast } from '@/lib/showToast';


export const DeleteServerModal = () => {

    const { isOpen, onClose, type, data } = useModal()

    const router = useRouter()

    const isModalOpen = isOpen && type === "deleteServer";

    const {server} = data;

    const [ isLoading, setIsLoading ] = useState(false)


    const onClick = async () => {
        try {
            setIsLoading(true)
            
            showToast({
                type:'loading', 
                message: 'Eliminando recurso'
            })

            await axios.delete(`/api/servers/${server?.id}`)
            dismissToast()

            
            router.refresh()
            router.push("/")
            onClose()

            showToast({
                type:'success', 
                message: 'Salón eliminado exitosamente!'
            })

        } catch (error) {
            showToast({
                type:'error', 
                message: 'El salón no pudo ser eliminado'
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
                        Eliminar salón
                    </DialogTitle>

                    <DialogDescription>
                        ¿Está seguro que desea eliminar <span 
                        className='font-semibold text-indigo-500'>{server?.name}</span>?
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

