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
 

const loginDefaultValues: IFormLogin = {
  password: "",
  emailAddress: ""
};

export const  SignInForm = () => {

  const router = useRouter();

  const form = useForm<IFormLogin>({
    defaultValues: loginDefaultValues,
    resolver: zodResolver(loginSchema)
  });

  const { isLoaded, signIn, setActive } = useSignIn();
  const [ isLoading, setIsLoading ] = useState(false)
  const [showPassword, setShowPassword] = useState(false)


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
        className="sm:w-[30%] w-[90%]"
        title={'Iniciar sesión'} 
        description={'Iniciar sesión ahora'}
    >

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-4 mt-4'>
            
            <div className="flex flex-col gap-2 w-full">

                <FormField 
                    disabled={isLoading}
                    control={form.control}
                    name='emailAddress'
                    render={({field}) => (
                        <FormItem
                            className="w-full"
                        >
                            <FormLabel
                                className=' text-sm font-bold text-zinc-500 dark:text-secondary/70'
                            >
                                Correo electronico
                            </FormLabel>

                            <FormControl>
                                    <Input
                                        minLength={3}
                                        maxLength={30}
                                        disabled={isLoaded}
                                        id='emailAddress'
                                        type='text'
                                        placeholder='Ingrese su correo'
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
                                className=' text-sm font-bold text-zinc-500 dark:text-secondary/70'
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
        <Label
            className='text-xs text-zinc-500 dark:text-secondary/70'
        >
            ¿Aún sin cuenta? <span 
              onClick={() => {router.push("/registro")}}
              className="font-bold underline hover:text-primary hover:cursor-pointer">Registrarse</span> 
        </Label>
      {/* <div>
        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input onChange={(e) => setEmailAddress(e.target.value)} id="email" name="email" type="email" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input onChange={(e) => setPassword(e.target.value)} id="password" name="password" type="password" />
          </div>
        </form>
      </div> */}
    </AuthCard>
  );
}