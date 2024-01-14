"use client"

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { CodeVerification } from "d4t-ui-demo";

export const VerificateEmailCode = () => {

  const { isLoaded, signUp, setActive } = useSignUp();

  const router = useRouter();

 
  const onPressVerify = async (code:string) => {

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
        router.push("/");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (

        <div className='w-full h-full'>
          <CodeVerification
            onComplete={onPressVerify}
            mode='numeric'
            disabled={!isLoaded}
            length={6}
          />
        </div>

   
  )
}