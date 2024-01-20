"use client"

import { IChatInput, chatInputSchema } from "@/lib/schemas/chat.schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Circle, Plus, Send,  } from "lucide-react"
import { Input } from "@/components/ui/input"
import axios from "axios"
import qs from "query-string"
import { useModal } from "@/hooks/use-modal-store"
import { EmojiPicker } from "@/components/emoji-picker"
import { useRouter } from 'next-nprogress-bar';
import { useCallback, useEffect, useRef, useState } from "react"
import { Member, MemberRole, Profile } from "@prisma/client"
import { cn } from "d4t-ui-demo"
import { translateText } from "@/lib/services/validateMessage"
import { ChatItemVerify } from "./chat-item-verify"


interface IResult {
  label: 'toxic',
  score: number
}

interface IChatInputProps {
    apiUrl: string
    query: Record<string, string>
    name: string
    member?: Member & {profile: Profile}
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

    const [result, setResult] = useState<IResult| null>();
    const [ready, setReady] = useState(false);
  
    const worker = useRef<any>(null);
      
    const form = useForm<IChatInput>({
      resolver: zodResolver(chatInputSchema),
      defaultValues: {
        content: "",
      }
    });
  
    const [isLoading, setIsLoading] = useState(false)
    const [input, setInput] = useState<IChatInput>()
    const [isToxic, setIsToxic] = useState<boolean>(false)


    const onSubmit = async (values: IChatInput) => {
      setInput(values)
      setIsLoading(true);
      setIsToxic(false)
      await classify(values.content)

    }

    const SendMessage = async (info: any) => {                    

        setResult(info);
            
        if (info.score as number <= 0.60) {
          try {
            
            form.reset();
      
            const url = qs.stringifyUrl({
              url: apiUrl,
              query,
            });
      
            await axios.post(url, input);
            setResult(null);
            router.refresh();
    
          } catch (error) {

            console.log(error);

          } finally {
            setIsToxic(false)
            setIsLoading(false)
          }
  
        }else {

          setIsLoading(false)
          setIsToxic(true)

        }

    }
  

    useEffect(() => {
      if (!worker.current) {
        worker.current = new Worker(new URL('../../app/worker.js', import.meta.url), {
          type: 'module'
        });
      }
  
      const onMessageReceived = (e: any) => {
        switch (e.data.status) {
          case 'initiate':
            setReady(false);
            break;
          case 'ready':
            setReady(true);
            break;
          case 'complete': 
            SendMessage(e.data.output[0])
            break;
        }

      };
  
      worker.current.addEventListener('message', onMessageReceived);
  
      return () => worker.current.removeEventListener('message', onMessageReceived);
    });
  
    const classify = useCallback(async (text:string) => {

      if (worker.current) {
        
        const t = await translateText(text)
        const response = t.data.responseData.translatedText        

        console.log({response});
        
        await worker.current.postMessage({ text: response });
        

      }
    }, []);

    return (

      <>

        {
          isLoading &&
            <ChatItemVerify
                id={''}
                content={input?.content as string}
                fileUrl={''}
                deleted={false}
                member={member}
            />
        }

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
                      isToxic && (
                        <div className="transition-all">
                          <Circle fill="#fca5a5" className={cn("absolute top-0 left-0 text-red-300 animate-ping opacity-75 z-50")}/>
                          <Circle fill="#fca5a5" className={cn("absolute top-0 left-0 text-red-300 z-50")}/>
                          <span className={cn("absolute font-semibold top-0 left-9 text-red-500 z-50 text-xs italic")}> 
                              El mensaje no pudo ser enviado por contenido inapropiado
                          </span>
                        </div>
                      )
                    }



                      {
                        type === "channel" && (member?.role === MemberRole.ADMIN || member?.role === MemberRole.MODERATOR) && (

                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => onOpen("messageFile", { apiUrl, query })}
                            className={cn(
                              "absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 z-30 transition rounded-full p-1 flex items-center justify-center",
                              isLoading ? "cursor-no-drop" : "hover:bg-zinc-600 dark:hover:bg-zinc-300",
                              result?.score! > 0.60  && 'animate-shake transition'

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
                              isLoading ? "cursor-no-drop" : "hover:bg-zinc-600 dark:hover:bg-zinc-300",
                              isToxic && 'animate-shake transition '
                              )}>
                            <Plus className="text-white dark:text-[#313338]" />
                          </button>
                        )
                      }
                      <Input
                        className={cn('px-14 py-6 pr-20 bg-zinc-200/90 dark:bg-zinc-700/75 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 border-none border-0',
                          isToxic && 'animate-shake transition border-solid animate-twice animate-duration-[1ms] border-[2px] border-rose-400',
                        )}
                        placeholder={`Enviar mensaje a ${type === "conversation" ? name : "#" + name}`}
                        {...field}
                      />
                      
                      <div className="absolute top-7 right-8">
                        <div className={cn("flex flex-row gap-2", isToxic && 'animate-shake transition')}>

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
      </>

    )
  }