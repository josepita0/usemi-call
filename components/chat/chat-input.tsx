"use client"

import { IChatInput, chatInputSchema } from "@/lib/schemas/chat.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { Plus, Send, Smile } from "lucide-react"
import { Input } from "../ui/input"
import axios from "axios"
import qs from "query-string"
import { ActionTooltip } from "../action-tooltip"
import { useModal } from "@/hooks/use-modal-store"


interface IChatInputProps {
    apiUrl: string
    query: Record<string, string>
    name: string
    type: "channel" | "conversation"

}

export const ChatInput = ({apiUrl, name, query, type}: IChatInputProps) => {
    
    const defaultValues: IChatInput = {
        content: ""
    }

    const { onOpen } = useModal()

    const form = useForm<IChatInput>({resolver: zodResolver(chatInputSchema), defaultValues: defaultValues})

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: IChatInput) => {
        
        console.log({values});
        
        try {
            
            const url = qs.stringifyUrl({
                url: apiUrl,
                query
            })

            await axios.post(url, values)

        } catch (error) {
            
            console.log(error);
              
        } 
        
    }

    return (

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name="content"
                    render={ ({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <ActionTooltip label="Cargar soportes"> 
                                        <button
                                            type="button"
                                            onClick={() => onOpen("messageFile", { apiUrl, query })}
                                            className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400
                                                hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center
                                                justify-center"
                                        >
                                            <Plus className="text-white dark:text-[#313338]"/>

                                        </button>
                                    </ActionTooltip>
                                    <Input
                                        disabled={isLoading}
                                        className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0
                                            text-zinc-600 dark:text-zinc-200
                                        "
                                        placeholder={`Mensaje ${type === "conversation" ? name : "#" + name}`}
                                        {...field}
                                    />

                                    <div className="absolute top-7 right-16">
                                        <Smile />
                                    </div>

                                    <ActionTooltip label="Enviar">
                                        <div className="absolute top-5 right-4 rounded-full hover:bg-[#02327c] transition p-2">
                                            <Send />
                                        </div>
                                    </ActionTooltip>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />


            </form>
        </Form>
    )
}