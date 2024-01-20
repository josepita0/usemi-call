'use client'

import { useDraw } from '@/hooks/use-drawing'
import { Draw } from '@/type'
import { useEffect, useState } from 'react'
import { ChromePicker } from 'react-color'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Eraser, Gavel, Palette, Pencil } from 'lucide-react'
import { cn } from 'd4t-ui-demo'
import { ActionTooltip } from '../action-tooltip'
import { useTheme } from 'next-themes'

interface pageProps {}

export const Drawing = ({}:pageProps) => {
  const [color, setColor] = useState<string>('#000')
  const { theme } = useTheme()

  console.log({theme});
  
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine)

  function drawLine({ prevPoint, currentPoint, ctx }: Draw) {
    const { x: currX, y: currY } = currentPoint
    const lineColor = color
    const lineWidth = 5

    let startPoint = prevPoint ?? currentPoint
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = lineColor
    ctx.moveTo(startPoint.x, startPoint.y)
    ctx.lineTo(currX, currY)
    ctx.stroke()

    ctx.fillStyle = lineColor
    ctx.beginPath()
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI)
    ctx.fill()
  }

  useEffect(() => {

        if(theme){
            theme === 'dark' ? setColor('#fff') : setColor('#000')
        }

  }, [theme])

  return (

    <>
        <div className=' w-full bg-white dark:bg-[#313338] flex flex-col justify-center items-center overflow-hidden'>
            <div
                className='dark:bg-[#2B2D31]  bg-[#F2F3F5] w-full flex flex-row items-center justify-center gap-4 p-4'
            >


                <ActionTooltip
                    label='Limpiar pizarra'
                >
                    <Eraser
                        size={30}
                        onClick={clear}
                        className={cn(
                            "text-zinc-500  dark:text-zinc-400 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300"

                        )}
                    />
                </ActionTooltip>
                
                    <Popover>
                            <PopoverTrigger>
                                
                            <ActionTooltip
                                label='Cambiar color'
                            >  
                            
                                <Palette
                                    size={30}
                                    className={cn(
                                        "text-zinc-500  dark:text-zinc-400 cursor-pointer hover:text-zinc-600 dark:hover:text-zinc-300"

                                    )}
                                />
                            </ActionTooltip>

                            </PopoverTrigger>

                            <PopoverContent
                                side="bottom"
                                sideOffset={40}
                                className="bg-transparent border-none shadow-none drop-shadow-none mb-16"
                            >
                                    
                                <ChromePicker className='' color={color} disableAlpha onChange={(e) => setColor(e.hex)} />
                                    
                            </PopoverContent>
                    </Popover>
                
            </div>
            <canvas
                ref={canvasRef}
                onMouseDown={onMouseDown}
                width={1000}
                height={1000}
                className='rounded-md'
            />

        </div>
    
    </>
  )
}
