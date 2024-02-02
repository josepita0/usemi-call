"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from '@/hooks/use-modal-store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Copy, Loader2, RefreshCcw, Send } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';
import { useState } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IFormSendInvation, sendInvitationSchema } from '@/lib/schemas/auth.schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { formatCodePhoneLines, formatPhoneNumber } from 'd4t-ui-demo';
import { handleOnlyNumbers } from '@/lib/handleNumbers';

import qs from "query-string"

const defaultValues: IFormSendInvation = {
    phoneNumber: '',
    phoneCode: '0424'
}

export const InviteModal = () => {


    const form = useForm<IFormSendInvation>({
        defaultValues,
        resolver: zodResolver(sendInvitationSchema)
      });
    

    const { isOpen, onOpen, onClose, type, data } = useModal()

    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invite";

    const {server} = data;

    const [ isCopied, setIsCopied ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`

    const onCopy = () => {

        navigator.clipboard.writeText(inviteUrl)
        setIsCopied(true)

        setTimeout(() => {
            setIsCopied(false)
        }, 1000);
    }

    const handleOnKeyUpPhoneNumber = (event: any) => {
        const { value } = event.target
    
        const phoneNumberFormated = formatPhoneNumber(value)
    
        form.setValue('phoneNumber', phoneNumberFormated)
      }
    

    const onNew = async () => {
        try {
            setIsLoading(true)

            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)

            onOpen('invite', {server: response.data} )
        } catch (error) {

            console.log(error);
            
        } finally {

            setIsLoading(false)

        }
    }

    const onSend = async (values: IFormSendInvation) => {

        setIsLoading(true)

        const phone: string = `+58${values.phoneCode.substring(1)}${values.phoneNumber.replace(/\s/g,'')}`

        const data = qs.stringify({
            "token": "ouamzdthgipmh4ce",
            "to": phone,
            "body": `Hola! Le habla *USEMI* 😊, ha sido invitado al salón de clases de la catedra *${server?.name}*, para ingresar vaya al siguiente enlace: ${inviteUrl}`
          });
        
          const config = {
            method: 'post',
            url: 'https://api.ultramsg.com/instance76759/messages/chat',
            headers: {  
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : data
          };
    
          axios(config)
          .then(function (response) {
            setIsLoading(false)
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            setIsLoading(false)
            console.log(error);
          });
        
    }

    return (
        
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden px-2'>

                <DialogHeader className='pt-8 px-6'>

                    <DialogTitle className='text-2xl text-center font-bold'>
                        Invita integrantes
                    </DialogTitle>

                </DialogHeader>

                <Tabs defaultValue="account" className="w-full">
                    <TabsList className='w-full'>
                        <TabsTrigger className='w-full' value="account">Enlace</TabsTrigger>
                        <TabsTrigger className='w-full' value="password">Mensaje</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">                
                        <div
                            className='p-6'
                        >
                            <Label 
                                className='uppercase text-xs font-bold 
                                text-zinc-500 dark:text-secondary/70'
                            >
                                Enlace de invitación
                            </Label>

                            <div className='flex items-center mt-2 gap-x-2'>
                                <Input 
                                    disabled={isLoading}
                                    className='bg-zinc-300/50 border-0 
                                    focus-visible:ring-0 text-black
                                    focus-visible:ring-offset-0'
                                    value={inviteUrl}
                                />
                                
                                <Button 
                                    disabled={isLoading}
                                    size="icon"
                                    onClick={onCopy}    
                                >
                                    { isCopied ? <Check className='w-4 h-4'/> : <Copy className='w-4 h-4'/> }
                                    

                                </Button>
                            </div>



                            <div className='flex flex-row justify-between'>
                                <Button
                                    disabled={isLoading}
                                    onClick={onNew}
                                    variant={'link'}
                                    size={'sm'}
                                    className='text-xs text-zinc mt-4'
                                >
                                    Generar un nuevo enlace
                                    <RefreshCcw className='w-4 h-4 ml-2'/>
                                </Button>

                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="password">

                    <div className="flex flex-col gap-1 w-full justify-end p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSend)}>
                                <FormLabel
                                        className=' text-sm font-bold text-zinc-500 dark:text-white'
                                    >
                                        Número celular
                                    </FormLabel>

                                <div className="flex flex-row justify-start items-start gap-1 w-full">

                                    <FormField 
                                        disabled={isLoading}
                                        control={form.control}
                                        name='phoneCode'
                                        render={({field}) => (
                                            <FormItem
                                                className="w-[20%]"
                                            >
                                                

                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >

                                                    <FormControl>

                                                        <SelectTrigger
                                                            className='bg-zinc-300/50 border-0
                                                            focus:ring-0 text-black ring-offset-0
                                                            focus:ring-offset-0 outline-none' 
                                                        >

                                                            <SelectValue className='text-zinc-500' placeholder=""/>

                                                        </SelectTrigger>

                                                    </FormControl>

                                                    <SelectContent>
                                                        {

                                                                formatCodePhoneLines().map((type) => (

                                                                    <SelectItem
                                                                        key={type.label}
                                                                        value={type.value}
                                                                        className='capitalize'
                                                                    >
                                                                        {type.label}
                                                                    </SelectItem>

                                                                

                                                            ))

                                                        }
                                                    </SelectContent>

                                                </Select>

                                                <FormMessage />

                                            </FormItem>
                                        )}
                                    />


                                    <FormField 
                                    disabled={isLoading}
                                        control={form.control}
                                        name='phoneNumber'
                                        render={({field}) => (
                                            <FormItem
                                                className="w-[80%]"
                                            >

                                                <FormControl>
                                                        <Input
                                                            minLength={7}
                                                            maxLength={7}
                                                            // disabled={isLoaded}
                                                            id='phoneNumber'
                                                            type='text'
                                                            onKeyPress={handleOnlyNumbers}
                                                            onKeyUp={handleOnKeyUpPhoneNumber}
                                                            placeholder='000 0000'
                                                            tabIndex={1}
                                                            {...field}
                                                        />

                                                </FormControl>
                                                <FormMessage />

                                            </FormItem>
                                        )}
                                    />

                                
                                </div>
                                
                                <div className='flex flex-row justify-end w-full'>
                                    <Button
                                        disabled={isLoading}
                                        variant={'primary'}
                                        className='text-sm text-white mt-4'
                                    >

                                        {
                                            !isLoading ? (
                                                <span className='flex flex-row items-center'>
                                                    Enviar invitación
                                                    <Send className='w-5 h-5 ml-2'/>
                                                </span>
                                            ) : (
                                                (<Loader2 className="w-6 h-6 text-white animate-spin my-4"/>)
                                            )
                                        }
                                    </Button>

                                </div>
                            </form>
                        </Form>

                    
                    </div>

                    </TabsContent>
                </Tabs>



            </DialogContent>
        </Dialog>

    )
}

