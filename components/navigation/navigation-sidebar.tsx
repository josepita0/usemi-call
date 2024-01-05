import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile"
import { NavigationAction } from "./navigation-actions";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

export const NavigationSidebar = async () => {

    const profile = await currentProfile();

    if(!profile){
        return redirect("/")
    }

    const servers = await db.server.findMany({
        where:{
            members:{
                some: {
                    profileId: profile.id
                }
            }
        }
    })
    

    return(
        <div
            className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22]"
        >
            <NavigationAction />
            <Separator
                className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
            />
            
            <ScrollArea className="flex-1 w-full h-full">               
                {
                    servers.map((s) => (
                        
                        <div key={s.id} className="mb-4">
                            <NavigationItem
                                id={s.id}
                                name={s.name}
                                imageUrl={s.imageUrl}
                            />
                        </div>
                    ))
                }
            </ScrollArea>

            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle/>
                <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-[48px] w-[48px]"
                        }
                    }}
                />
            </div>
        </div>
    )
}