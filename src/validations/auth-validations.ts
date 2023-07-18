import {
  isString,
  match,
  maxLength,
  minLength,
  required,
} from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

export const authValidationSchema = {
  login: [
    required,
    isString,
    match(/\+7\d\d\d\d\d\d\d\d\d\d/g, true),
    maxLength(12),
  ],
  password: [required, isString, minLength(8)],
};
