"use client"

import { useEffect, useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import AuthCard from "@/components/auth/components/auth-card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { IFormLogin, loginSchema } from "@/lib/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { Label } from "d4t-ui-demo";
import { showToast } from "@/lib/showToast";
import { useRouter } from 'next-nprogress-bar';
 
import Logo from "@/public/Untitled-3.png";
import dummy from "@/public/imgInitWithoutColor.png";
import dummy2 from "@/public/imgRegister.png";
import Image from "next/image";
import SignUpForm from "../register/register";
import { ScrollArea } from "@/components/ui/scroll-area";

const loginDefaultValues: IFormLogin = {
  password: "",
  emailAddress: ""
};

export const  SignInForm = () => {

  const [isAnimated, setIsAnimated] = useState(true);

  const router = useRouter();

  const form = useForm<IFormLogin>({
    defaultValues: loginDefaultValues,
    resolver: zodResolver(loginSchema)
  });

  const { isLoaded, signIn, setActive } = useSignIn();
  const [ isLoading, setIsLoading ] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const title = 'Iniciar sesión'
  const description = 'Listo para empezar ver tus clases!'

  const onSubmit = async (values: IFormLogin) => {

    const { password, emailAddress } = values

    setIsLoading(true)

    if (!isLoaded) {
      return;
    }
 
    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });
 
      if (result.status === "complete") {
        console.log({success:result});
        await setActive({ session: result.createdSessionId });
        
        showToast({
          type: "success",
          message: "Inicio de sesión exitoso!"
        })

        router.push("/")
      }
      else {
        /*Investigate why the login hasn't completed */
        console.log({error:result});
      }
 
    } catch (err: any) {

      if(err.errors[0].code === "form_identifier_not_found" || err.errors[0].code === "form_password_incorrect"){
        showToast({
          type:"error",
          message:"Credenciales invalidas"
        })
      }
      
      console.error("error", err.errors[0].longMessage)
    } finally {
      setIsLoading(false)
    }
  };

 
  return (

    <AuthCard 
        className="sm:w-[80%] h-[70%] w-full"
        title={'Iniciar sesión'} 
        description={'Iniciar sesión ahora'}
    >

        <div className="h-full w-full bg-transparent relative overflow-hidden rounded-lg">



          <div 
              id="signin"
              className={`bg-transparent absolute top-0 left-0 h-full sm:w-1/2 px-7 flex flex-col justify-center items-center transition-all duration-700 ease-in-out z-20 ${
                isAnimated ? "translate-x-full opacity-0" : ""
              }`}
          >

                <div className="sm:hidden w-full rounded-3xl">
                    <div className='container my-6'>
                      <Image src={Logo} width={200} alt='univ-santa-maria' />
                    </div>
                </div>

                <div className="w-full sm:mt-4">
                  <h5 className='font-bold text-2xl'>Registro</h5>
                  <p className='text-sm text-zinc-400'>Unete a la familia de la USM!</p>
                </div>

                <ScrollArea
                  className="h-full w-full flex flex-col justify-around items-center mb-2"
                >

                  <SignUpForm
                    setIsAnimated={setIsAnimated}
                  />
                
                </ScrollArea>


              {/* <div className="h-full w-full flex flex-col justify-around items-center mb-2">
          
            </div> */}

          </div>

          <div
            id="signup"
            className={`absolute top-0 left-0 h-full w-full sm:w-1/2 flex flex-col px-7 justify-center items-center transition-all duration-700 ease-in-out ${
              isAnimated
                ? "sm:translate-x-full opacity-100 z-50 animate-show"
                : "opacity-0 z-10"
            }`}
          >
            <div className="h-full w-full flex flex-col justify-around items-center">

               <div className="sm:hidden w-full rounded-3xl">
                    <div className='container my-6'>
                      <Image src={Logo} width={200} alt='univ-santa-maria' />
                    </div>
                </div>

              <div className="w-full ">
                <h5 className='font-bold text-2xl'>{title}</h5>
                <p className='text-sm text-zinc-400'>Bienvenido!</p>
                {description && <p className='text-sm text-zinc-400'>{description}</p>}
              </div>

              <div className="w-full">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-4 mt-4'>
                    
                    <div className="flex flex-col gap-5 w-full">

                        <FormField 
                            disabled={isLoading}
                            control={form.control}
                            name='emailAddress'
                            render={({field}) => (
                                <FormItem
                                    className="w-full"
                                >
                                    <FormLabel
                                        className=' text-sm font-bold text-zinc-500 dark:text-white'
                                    >
                                        Nombre de usuario
                                    </FormLabel>

                                    <FormControl>
                                            <Input
                                                minLength={3}
                                                maxLength={30}
                                                disabled={isLoaded}
                                                id='emailAddress'
                                                type='text'
                                                placeholder='Ingrese su usuario'
                                                tabIndex={1}
                                                {...field}
                                            />

                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            )}
                        />

                        <FormField 
                            disabled={isLoading}
                            control={form.control}
                            name='password'
                            render={({field}) => (
                                <FormItem
                                    className="w-full"
                                >
                                    <FormLabel
                                        className=' text-sm font-bold text-zinc-500 dark:text-white'
                                    >
                                        Contraseña 
                                    </FormLabel>

                                    <FormControl>

                                        <div className="flex relative">
                                            <Input
                                                minLength={9}
                                                maxLength={15}
                                                disabled={isLoaded}
                                                id='password'
                                                placeholder='Ingrese su contraseña'
                                                tabIndex={1}
                                                {...field}

                                                type={showPassword ? "text" : "password"}
                                                className={cn("hide-password-toggle pr-10")}
                                            >

                                                
                                            </Input>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                disabled={!isLoaded}
                                            >
                                                {!showPassword ? (
                                                    <EyeIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <EyeOffIcon
                                                        className="h-5 w-5"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                <span className="sr-only">
                                                    {showPassword ? "Esconder contraseña" : "Mostrar contraseña"}
                                                </span>
                                            </Button>
                                        
                                        </div>


                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            )}
                        />

                    </div>

                    <Button 
                      disabled={isLoading}
                      variant={"primary"}
                    >
                      {
                        !isLoading 
                          ?
                            ("Iniciar sesión")
                          :
                            (<Loader2 className="w-6 h-6 text-white animate-spin my-4"/>)
                      }
                      
                    </Button>
            

                    </form> 
                </Form>

                <div className="w-full flex flex-row justify-between">

                <Label
                    className='text-xs text-zinc-500 dark:text-white'
                >
                    ¿Aún sin cuenta? <span 
                      onClick={() => setIsAnimated(prev => !prev)}
                      className="font-bold underline dark:text-white hover:dark:text-[#DCE4F9] hover:text-primary hover:cursor-pointer">Registrarse</span> 
                </Label>

                <Label
                    className='text-xs text-zinc-500 dark:text-white'
                >
                    <span 
                      className="font-bold hover:text-primary">V 1.0.0</span> 
                </Label>
                </div>

              </div>

            </div>
          </div>


          <div
            id="overlay-container"
            className={`hidden sm:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition transition-transform duration-700 ease-in-out z-100 ${
              isAnimated ? "-translate-x-full" : ""
            }`}
          >

            <div
              id="overlay"
              className={`relative -left-full h-full w-[200%] transform transition transition-transform duration-700 ease-in-out ${
                isAnimated ? "translate-x-1/2" : "translate-x-0"
              }`}
            >

              <div  
                id="overlay-left"
                className={`w-1/2 h-full absolute flex justify-center items-center top-0 transform -translate-x-[20%] transition transition-transform duration-700 ease-in-out ${
                  isAnimated ? "translate-x-0" : "-translate-x-[20%]"
                }`}
              >

                  <div className="w-full bg-[#EEF2FC] h-full rounded-tl-3xl rounded-bl-3xl">
                    <div className='container my-6'>
                      <Image src={Logo} width={200} alt='univ-santa-maria' />
                    </div>
                    <div className='w-full flex items-center justify-center'>
                      <Image src={dummy} width={550} alt='univ-santa-maria' />
                    </div>

                  </div>


              </div>

              <div
                id="overlay-right"
                className={`w-1/2 h-full absolute flex justify-center items-center top-0 right-0 transform transition transition-transform duration-700 ease-in-out ${
                  isAnimated ? "translate-x-[20%]" : "translate-x-0"
                }`}
              >
                  <div className="w-full bg-[#EEF2FC] rounded-tr-3xl h-full rounded-br-3xl flex flex-col justify-evenly">
                    <div className='container flex justify-end'>
                      <Image src={Logo} width={200} alt='univ-santa-maria' />
                    </div>
                    <div className='w-full flex items-center justify-center'>
                      <Image src={dummy2} width={350} alt='univ-santa-maria' />
                    </div>

                  </div>
              </div>
            
            </div>
          
          </div>

        </div>


    </AuthCard>
  );
}