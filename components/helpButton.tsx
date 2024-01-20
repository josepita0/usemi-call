"use client"

import { HelpCircle } from "lucide-react";

import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export const HelpButton = () => {
    
    const driverObj2 = driver({
        // showProgress: true,
        doneBtnText: "Finalizar",
        prevBtnText: "Anterior",
        nextBtnText: "Siguiente",
        smoothScroll: true,

        steps: [
            { 
                element: '#create-server',
                popover: { 
                    title: 'Crear servidor', 
                    description: 'Aquí puedes crear tus servidores, para ver tus clases!', 
                    side: "left", 
                    align: 'start',
                    popoverClass: 'my-custom-popover-class',
                    
                },

            },
        //   { element: 'code .line:nth-child(1)', popover: { title: 'Import the Library', description: 'It works the same in vanilla JavaScript as well as frameworks.', side: "bottom", align: 'start' }},
        //   { element: 'code .line:nth-child(2)', popover: { title: 'Importing CSS', description: 'Import the CSS which gives you the default styling for popover and overlay.', side: "bottom", align: 'start' }},
        //   { element: 'code .line:nth-child(4) span:nth-child(7)', popover: { title: 'Create Driver', description: 'Simply call the driver function to create a driver.js instance', side: "left", align: 'start' }},
        //   { element: 'code .line:nth-child(18)', popover: { title: 'Start Tour', description: 'Call the drive method to start the tour and your tour will be started.', side: "top", align: 'start' }},
        //   { element: 'a[href="/docs/configuration"]', popover: { title: 'More Configuration', description: 'Look at this page for all the configuration options you can pass.', side: "right", align: 'start' }},
        //   { popover: { title: 'Happy Coding', description: 'And that is all, go ahead and start adding tours to your applications.' } }
        ]
      });


    useEffect(() => {
        // driverObj.destroy()
        // driverObj.drive()
    }, [])      
    return (

        <Button className="bg-transparent border-0" variant="outline" size="icon">
            <HelpCircle size={25} id="help-button" onClick={() => driverObj2.drive()}/>
        </Button>

    )
}