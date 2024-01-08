import { Hash } from "lucide-react"


interface IChatWelcomeProps {
    name: string
    type: "channel" | "conversation"
 }

export const ChatWelcome = ({name, type}:IChatWelcomeProps) => {


    return (

        <div className="space-y-2 px-4 mb-4">

            {type === "channel" && (
                <div
                className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center"
                >
                    <Hash className="w-12 h-12 text-white"/>
                </div>
            )}

            <p className="text-xl md:text-3xl font-bold">
                {type === "channel" ? `Bienvenido a #` : ""}{name}
            </p>

            <p className="text-zinc-600 dark:text-zinc-400 text-sm">
               {type === "channel" 
                    ? `Inicio del canal #${name}`
                    : `Inicio del su conversación con ${name}`
               }
            </p>


        </div>
    )
}