"use client"

import { Smile } from "lucide-react"

import Picker from "@emoji-mart/react"

import data from "@emoji-mart/data"

import i18n from '@emoji-mart/data/i18n/es.json'


import { useTheme } from "next-themes"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "d4t-ui-demo"

interface IEmojiPickerProps {
    disabled: boolean
    onChange: (value: string) => void
}

export const EmojiPicker = ({ onChange, disabled }: IEmojiPickerProps) => {

    const { resolvedTheme } = useTheme()
    
    return (

        <Popover>
            <PopoverTrigger
                disabled={disabled}

            >
                <Smile
                    className={cn(
                        "text-[#163273]/70  dark:text-zinc-400",
                        disabled ? "cursor-no-drop" : "cursor-pointer hover:text-[#163273] dark:hover:text-zinc-300"

                    )}
                >

                </Smile>
            </PopoverTrigger>

            <PopoverContent
                side="right"
                sideOffset={40}
                className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
            >
                <Picker 
                    theme={resolvedTheme}
                    data={data}
                    i18n={i18n}
                    onEmojiSelect={(emoji: any) => onChange(emoji.native)}
                />
            </PopoverContent>
        </Popover>
    )
}