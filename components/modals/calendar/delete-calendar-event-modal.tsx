"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';
import qs from "query-string"


export const DeleteCalendarEventModal = () => {

    const { isOpen, onClose, type, data } = useModal()

    const isModalOpen = isOpen && type === "deleteCalendarEvent";

    const { apiUrl, query } = data;

    
    
    const [ isLoading, setIsLoading ] = useState(false)
    
    const onClick = async () => {
        console.log({query});
        try {
            setIsLoading(true)

            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query: query
            })
            
            await axios.delete(url)

            onClose()
        } catch (error) {
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
                        Eliminar evento
                    </DialogTitle>

                    <DialogDescription>
                        ¿Está seguro que desea eliminar un evento?
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

