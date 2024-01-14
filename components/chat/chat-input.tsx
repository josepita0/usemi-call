"use client"

import { IChatInput, chatInputSchema } from "@/lib/schemas/chat.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Plus, Send,  } from "lucide-react"
import { Input } from "@/components/ui/input"
import axios from "axios"
import qs from "query-string"
import { ActionTooltip } from "@/components/action-tooltip"
import { useModal } from "@/hooks/use-modal-store"
import { EmojiPicker } from "@/components/emoji-picker"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Member, MemberRole } from "@prisma/client"
import { cn } from "d4t-ui-demo"


interface IChatInputProps {
    apiUrl: string
    query: Record<string, string>
    name: string
    member?: Member
    type: "channel" | "conversation"

}

export const ChatInput = ({
    apiUrl,
    query,
    name,
    member,
    type,
  }: IChatInputProps) => {
    const { onOpen } = useModal();
    const router = useRouter();
      
    const form = useForm<IChatInput>({
      resolver: zodResolver(chatInputSchema),
      defaultValues: {
        content: "",
      }
    });
  
    const [isLoading, setIsLoading] = useState(false)
    
    const onSubmit = async (values: IChatInput) => {
      try {
        setIsLoading(true)
        const url = qs.stringifyUrl({
          url: apiUrl,
          query,
        });
  
        await axios.post(url, values);
  
        form.reset();
        router.refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false)

      }
    }
  
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            disabled={isLoading}
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative p-4 pb-6">
                    {
                      type === "channel" && (member?.role === MemberRole.ADMIN || member?.role === MemberRole.MODERATOR) && (

                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => onOpen("messageFile", { apiUrl, query })}
                          className={cn(
                            "absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400  transition rounded-full p-1 flex items-center justify-center",
                            isLoading ? "cursor-no-drop" : "hover:bg-zinc-600 dark:hover:bg-zinc-300"
                            )}>
                          <Plus className={cn("text-white dark:text-[#313338]" )} />
                        </button>
                      )
                    }

                    {
                      type === "conversation" && (

                        <button
                          disabled
                          type="button"
                          onClick={() => onOpen("messageFile", { apiUrl, query })}
                          className={cn(
                            "absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400  transition rounded-full p-1 flex items-center justify-center",
                            isLoading ? "cursor-no-drop" : "hover:bg-zinc-600 dark:hover:bg-zinc-300"
                            )}>
                          <Plus className="text-white dark:text-[#313338]" />
                        </button>
                      )
                    }
                    <Input
                      className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                      placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                      {...field}
                    />
                    <div className="absolute top-7 right-8">
                      <div className="flex flex-row gap-2">

                        <EmojiPicker
                          disabled={isLoading}
                          onChange={(emoji: string) => field.onChange(`${field.value} ${emoji}`)}
                        />

                        <Send 
                          onClick={() => onSubmit(form.getValues())}
                          className={cn(
                              "text-zinc-500  dark:text-zinc-400",
                              isLoading ? "cursor-no-drop" : "cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300"

                            )}
                          size={25}/>
                        
                      </div>
                    </div>

                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    )
  }