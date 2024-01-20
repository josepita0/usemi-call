"use client"

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from 'next-nprogress-bar';

import { CodeVerification } from "d4t-ui-demo";
import { useState } from "react";
import { showToast } from "@/lib/showToast";

export const VerificateEmailCode = () => {

  const { isLoaded, signUp, setActive } = useSignUp();
  const [ isLoading, setIsLoading ] = useState(false)

  const router = useRouter();

 
  const onPressVerify = async (code:string) => {
    setIsLoading(true)
    if (!isLoaded) {
      return;
    }
 
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {

        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId })
        showToast({
          type: "success",
          message: "El codigo fue confirmado exitosamente!"
        })

        router.push("/");
      }
    } catch (err: any) {
      console.log({err});
      
      if(err.errors[0].code === "form_code_incorrect"){
        showToast({
          type:"error",
          message: "Codigo incorrecto, por favor verificar"
        })
      }

      if(err.errors[0].code === "verification_failed"){
        showToast({
          type:"error",
          message: "Demasiados intentos fallidos. Intente con otro método"
        })
      }

    } finally {
      setIsLoading(false)
    }
  };

  return (

        <div className='w-full h-full mt-4'>
          <CodeVerification
            onComplete={onPressVerify}
            mode='numeric'
            disabled={isLoading}
            length={6}
          />
        </div>

   
  )
}