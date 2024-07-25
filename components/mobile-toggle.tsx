
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "./modals/navigation/navigation-sidebar"
import { ServerSidebar } from "./server/server-sidebar"


export const MobileToggle = ({serverId}:{serverId: string}) => {
    return (
        
        <Sheet>
            <SheetTrigger>
                <Button variant={"ghost"} size={"icon"} className="md:hidden">
                    <Menu className="text-white"/>
                </Button>
            </SheetTrigger>

            <SheetContent side={"left"} className="p-0 flex gap-0">
                <div className="w-[72px]">
                    <NavigationSidebar />
                </div>
                <ServerSidebar 
                    serverId={serverId}
                />
            </SheetContent>
        </Sheet>
    )
}