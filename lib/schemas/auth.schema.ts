import * as z from "zod";
import { COMMON_VALIDATORS } from "./common.schema";

export const loginSchema = z.object({
  emailAddress: COMMON_VALIDATORS.EMAIL,
  password: COMMON_VALIDATORS.STRING,
});

export const registerSchema = z.object({
    username: COMMON_VALIDATORS.STRING,
    password: COMMON_VALIDATORS.PASSWORD,
    confirmPassword: COMMON_VALIDATORS.PASSWORD,
    emailAddress: COMMON_VALIDATORS.EMAIL,
    firstName: COMMON_VALIDATORS.STRING,
    lastName: COMMON_VALIDATORS.STRING,
    pidType: COMMON_VALIDATORS.STRING,
    pid: COMMON_VALIDATORS.STRING,
}).superRefine(({confirmPassword, password}, ctx) => {

    if (confirmPassword !== password) {

      ctx.addIssue({
        code: "custom",
        message: "No coinciden las contraseñas",
        path: ["confirmPassword"]
      });

    }

  });



export const setNewPasswordSchema = z
.object({
    password: COMMON_VALIDATORS.STRING,
    confirmPassword: COMMON_VALIDATORS.STRING
})
.superRefine(({confirmPassword, password}, ctx) => {
    
    if (confirmPassword !== password) {
        
        ctx.addIssue({
            code: "custom",
            message: "No coinciden las contraseñas",
            path: ["confirmPassword"]
        });
        
    }
    
});

export interface IFormLogin extends z.infer<typeof loginSchema> {}
export interface IFormRegister extends z.infer<typeof registerSchema> {}
export interface IFormSetNewPassword extends z.infer<typeof setNewPasswordSchema> {}
