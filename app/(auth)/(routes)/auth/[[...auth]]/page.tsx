import { SignInForm } from "@/components/auth/auth/auth";
import Image from "next/image";

export default function Page() {
    return (

        // <Image src="/Fondo 2.jpg" width={100} height={100} alt="background" />
        
        <div className='bg-fondo2 bg-cover w-full h-full flex justify-center sm:items-center items-end'
        >
            <SignInForm />
        </div>    
    )
}