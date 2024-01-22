"use client"

import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label, formatCI } from "d4t-ui-demo";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";

import { handleOnlyNumbers } from "@/lib/handleNumbers";
import { IFormRegister, registerSchema } from "@/lib/schemas/auth.schema";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VerificateEmailCode } from "./validateEmail";
import { AuthCard } from "@/components/auth/components/auth-card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from 'next-nprogress-bar';
import { showToast } from "@/lib/showToast";

const registerDefaultValues: IFormRegister = {
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    emailAddress: "",
    pidType: "V",
    pid: "",
    confirmPassword: ""
};


const pidType = {
    V: "V",
    E: "E"
}

interface errors {
    code: "form_identifier_exists" | "form_username_invalid_character"
    longMessage: string 
    message: string
    meta:{
        paramName: "username" | "email_address"
    }
}

export default function SignUpForm({setIsAnimated}: {setIsAnimated: Dispatch<SetStateAction<boolean>>}) {

  const { isLoaded, signUp } = useSignUp();
  const [ isLoading, setIsLoading ] = useState(false)

  const form = useForm<IFormRegister>({
    defaultValues: registerDefaultValues,
    resolver: zodResolver(registerSchema)
  });

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setConfirmShowPassword] = useState(false)

  const [pendingVerification, setPendingVerification] = useState(false);

  const onSubmit = async (values:IFormRegister) => {
    setIsLoading(true)

    console.log({values});

    const { firstName, lastName, password, emailAddress, username} = values

    const pid: string = `${values.pidType}-${values.pid}`

    if (!isLoaded) {
      return;
    }

    
 
    try {
      await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
        username,
        unsafeMetadata: {
            pid
        }
      });
 
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      showToast({
        type: "success",
        message: "El codigo de verificación fue enviado exitosamente!"
      })
      setPendingVerification(true);
    } catch (err: any) {
        console.log({err});
        
        for (let e of err.errors){

            if(e.code === "form_identifier_exists" && e.meta.paramName === "email_address"){
                showToast({
                    type: "error",
                    message: "El correo electronico ya fue usado, por favor selecionar otro"
                })
            }
    
            if(e.code === "form_identifier_exists" && e.meta.paramName === "username"){
                showToast({
                    type: "error",
                    message: "El nombre de usuario ya fue usado, por favor selecionar otro"
                })
            }
    
            if(e.code === "form_username_invalid_character" && e.meta.paramName === "username"){
                showToast({
                    type: "error",
                    message: "El nombre de usuario solo puede contener letras, números y '-' o '_'"
                })
            }
        }
    
        // if(err)
    } finally {
        setIsLoading(false)
    }
  };
 
  const formatNumber = (event:any) => {

    const { value } = event.target;
    const number = formatCI(value);
    form.setValue("pid", number);

  };  

  return (

    <>
    
        {!pendingVerification && (
        
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-4 mt-5 w-full overflow-auto '>
    
                <div className="flex flex-col gap-2 sm:flex-row w-full">

                    <FormField 
                    disabled={isLoading}
                        control={form.control}
                        name='firstName'
                        render={({field}) => (
                            <FormItem
                                className="w-full"
                            >
                                <FormLabel
                                    className=' text-sm font-bold text-zinc-500 dark:text-white'
                                >
                                    Nombre
                                </FormLabel>

                                <FormControl>
                                        <Input
                                            minLength={3}
                                            maxLength={30}
                                            disabled={isLoaded}
                                            id='firstName'
                                            type='text'
                                            placeholder='Ingrese su nombre'
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
                        name='lastName'
                        render={({field}) => (
                            <FormItem
                                className="w-full"
                            >
                                <FormLabel
                                    className=' text-sm font-bold text-zinc-500 dark:text-white'
                                >
                                    Apellido
                                </FormLabel>

                                <FormControl>
                                        <Input
                                            minLength={3}
                                            maxLength={30}
                                            disabled={isLoaded}
                                            id='lastName'
                                            type='text'
                                            placeholder='Ingrese su apellido'
                                            tabIndex={1}
                                            {...field}
                                        />

                                </FormControl>
                                <FormMessage />

                            </FormItem>
                        )}
                    />


                </div>

                <div className="flex flex-col gap-2 sm:flex-row w-full">
                    <FormField 
                    disabled={isLoading}
                        control={form.control}
                        name='username'
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
                                            minLength={5}
                                            maxLength={30}
                                            disabled={isLoaded}
                                            id='username'
                                            type='text'
                                            placeholder='Ingrese su nombre de usuario'
                                            tabIndex={1}
                                            {...field}
                                        />

                                </FormControl>
                                <FormMessage />

                            </FormItem>
                        )}
                    />
                    
                    
                    <div className="flex flex-col gap-1 w-full justify-end">
                                <FormLabel
                                        className=' text-sm font-bold text-zinc-500 dark:text-white'
                                    >
                                        Documento de identidad
                                    </FormLabel>

                    <div className="flex flex-row justify-start items-start gap-1 w-full">

                        <FormField 
                        disabled={isLoading}
                            control={form.control}
                            name='pidType'
                            render={({field}) => (
                                <FormItem
                                    className="w-[20%]"
                                >
                                    

                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >

                                        <FormControl>

                                            <SelectTrigger
                                                className='bg-zinc-300/50 border-0
                                                focus:ring-0 text-black ring-offset-0
                                                focus:ring-offset-0 outline-none' 
                                            >

                                                <SelectValue className='text-zinc-500' placeholder=""/>

                                            </SelectTrigger>

                                        </FormControl>

                                        <SelectContent>
                                            {
                                                Object.values(pidType).map((type) => (

                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                            className='capitalize'
                                                        >
                                                            {type}
                                                        </SelectItem>

                                                    

                                                ))

                                            }
                                        </SelectContent>

                                    </Select>

                                    <FormMessage />

                                </FormItem>
                            )}
                        />


                        <FormField 
                        disabled={isLoading}
                            control={form.control}
                            name='pid'
                            render={({field}) => (
                                <FormItem
                                    className="w-[80%]"
                                >

                                    <FormControl>
                                            <Input
                                                minLength={1}
                                                maxLength={10}
                                                disabled={isLoaded}
                                                id='pid'
                                                type='text'
                                                onKeyUp={formatNumber}
                                                onKeyPress={handleOnlyNumbers}
                                                placeholder='Ingrese su cedula'
                                                tabIndex={1}
                                                {...field}
                                            />

                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            )}
                        />

                    
                    </div>
                    
                    </div>



                </div>    

                <div className="flex flex-col gap-2 sm:flex-row w-full">
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
                                    Correo electronico 
                                </FormLabel>

                                <FormControl>
                                        <Input
                                            minLength={5}
                                            maxLength={50}
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
                    


                </div>                      
                
                <div className="flex flex-col gap-2 sm:flex-row w-full">
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
                                            placeholder='Ingrese su nombre de usuario'
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

                    <FormField
                    disabled={isLoading}

                        control={form.control}
                        name='confirmPassword'
                        render={({field}) => (
                            <FormItem
                                className="w-full"
                            >
                                <FormLabel
                                    className=' text-sm font-bold text-zinc-500 dark:text-white'
                                >
                                    Confirmar contraseña 
                                </FormLabel>

                                <FormControl>

                                    <div className="flex relative">
                                        <Input
                                            minLength={9}
                                            maxLength={15}
                                            disabled={isLoaded}
                                            id='password'
                                            placeholder='Ingrese su nombre de usuario'
                                            tabIndex={1}
                                            {...field}

                                            type={showConfirmPassword ? "text" : "password"}
                                            className={cn("hide-password-toggle pr-10")}
                                        >

                                            
                                        </Input>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setConfirmShowPassword((prev) => !prev)}
                                            disabled={!isLoaded}
                                        >
                                            {!showConfirmPassword ? (
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
                                                {showConfirmPassword ? "Esconder contraseña" : "Mostrar contraseña"}
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
                            ("Registrarse")
                        :
                            (<Loader2 className="w-6 h-6 text-white animate-spin my-4"/>)
                    }
                    
                </Button>
    
                <Label
                    className='text-xs text-zinc-500 dark:text-white'
                >
                    ¿Ya posees una cuenta? <span 
                    onClick={() => setIsAnimated(prev => !prev)}
                    className="font-bold underline dark:text-white hover:dark:text-[#DCE4F9] hover:text-primary hover:cursor-pointer">Iniciar sesión</span> 
                </Label>
            </form>
            </Form>

        )}

        {pendingVerification && (
        
            <VerificateEmailCode/>

        )}

    </>


  );
}