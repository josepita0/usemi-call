"use client"

import { HelpCircle } from "lucide-react";

import { Config, driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Button } from "@/components/ui/button";

export const HelpButton = () => {
    const config:Config = {
        doneBtnText: "Finalizar",
        prevBtnText: "Anterior",
        nextBtnText: "Siguiente",
        smoothScroll: true,

        steps:  [
                { 
                    element: '#create-server',
                    popover: { 
                        title: 'Crear salón', 
                        description: 'Aquí puedes crear tus salones, para ver tus clases!', 
                        side: "left", 
                        align: 'start',
                        popoverClass: 'my-custom-popover-class',
                        
                    },
    
                },
                { 
                    element: '#server-header',
                    popover: { 
                        title: 'Gestionar salón', 
                        description: 'Podras actualizar y gestionar tu salón como prefieras!', 
                        side: "left", 
                        align: 'start',
                        popoverClass: 'my-custom-popover-class',
                        
                    },
    
                },
                { 
                    element: '#home-btn',
                    popover: { 
                        title: 'Inicio', 
                        description: 'Acá el profesor podrá dejar comentarios y documentos para que sea lo primero a ver!', 
                        side: "left", 
                        align: 'start',
                        popoverClass: 'my-custom-popover-class',
                        
                    },
    
                },
                { 
                    element: '#calendar-btn',
                    popover: { 
                        title: 'Calendario', 
                        description: 'Organiza tus eventos como mejor prefieras!', 
                        side: "left", 
                        align: 'start',
                        popoverClass: 'my-custom-popover-class',
                        
                    },
    
                },
                { 
                    element: '#channels-text',
                    popover: { 
                        title: 'Canales', 
                        description: 'Aquí estarán tus canales, donde podrás hablar con los integrantes del salón!', 
                        side: "left", 
                        align: 'start',
                        popoverClass: 'my-custom-popover-class',
                        
                    },
    
                },
                { 
                    element: '#mode-toggle',
                    popover: { 
                        title: 'Oscuro o claro?', 
                        description: 'Podrás cambiar tu modo para que se vea mejor!', 
                        side: "left", 
                        align: 'start',
                        popoverClass: 'my-custom-popover-class',
                        
                    },
    
                },
            ]
      }

    
    const driverObj2 = driver(config);

    
    return (

        <Button className="bg-transparent border-0 group" variant="outline" size="icon">
            <HelpCircle size={25} id="help-button" className="text-white group-hover:dark:text-white group-hover:text-black" onClick={() => {
                driverObj2.refresh()
                driverObj2.drive()
            }}/>
        </Button>

    )
}