import * as z from "zod";

const REGEXS = {
  STRING_REQUIRED: /^(?!\s*$).+/
};

const MIN_LENGTH = 9;
const MAX_LENGTH = 30;

const hasLetter = (value: string) => /[a-zA-Z]/.test(value);
const hasNumber = (value: string) => /\d/.test(value);
const hasSpecialChar = (value: string) => /[@$!%*#?&]/.test(value);
const hasMinLength = (value: string) => value.length >= MIN_LENGTH;
const hasMaxLength = (value: string) => value.length <= MAX_LENGTH;

const hasSpecialCharMessage = "Requiere al menos una carácter especial";
const hasNumberMessage = "Requiere al menos una número";
const hasLetterMessage = "Requiere al menos una letra";
const hasMinLengthMessage = "Mínimo 9 caracteres";
const hasMaxLengthMessage = "Máximo 30 caracteres";

export const COMMON_VALIDATORS = {
  STRING: z
    .string({
      required_error: "Requerido",
      invalid_type_error: "Debe ser texto"
    })
    .nonempty({message: "Requerido"}),

  EMAIL: z
    .string({
      required_error: "Requerido",
      invalid_type_error: "Correo no valida"
    })
    .regex(REGEXS.STRING_REQUIRED, "Requerido")
    .email("Correo no valido"),

  PASSWORD: z
    .string({
      required_error: "Requerido",
      invalid_type_error: "Contraseña no valida"
    })
    .regex(REGEXS.STRING_REQUIRED, "Requerido")
    .refine(hasLetter, hasLetterMessage)
    .refine(hasNumber, hasNumberMessage)
    .refine(hasSpecialChar, hasSpecialCharMessage)
    .refine(hasMinLength, hasMinLengthMessage)
    .refine(hasMaxLength, hasMaxLengthMessage),

  UUID: z.string().uuid(),
  NUMBER: z.number(),
  BOOLEAN: z.boolean()
};

export const LocationSchema = z.object({
  coords: COMMON_VALIDATORS.STRING,
  address: COMMON_VALIDATORS.STRING
});
