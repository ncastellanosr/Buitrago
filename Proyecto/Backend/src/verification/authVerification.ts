//verficar contraseña
import { Response } from "express";
    //mínimo 8 caractéres
function minLen(password: string){
        return password.length>=8;
    }
    //mínimo una mayúscula
function hasUpper(password:string){
        const patron = /[A-Z]/
        for (const char of password){
            if(patron.test(char))
                return true
        }
        return false
    }
    //mínimo un dígito
function hasDigit(password:string){
        const patronN = /[0-9]/
        for (const char of password){
            if(patronN.test(char))
                return true
        }
        return false
    }
    //no espacios
function  hasSpace(password:string){
        for (const char of password){
            if(char==' ')
                return false
        }
        return true
    }

export function  passwordVerification(password: string){
        if (!minLen(password)){
            // console.log("Contraseña debe tener mínimo 8 caractéres.")
            // Response.status(400).json({message: "Password must be at least 8 characters long"})
            return false
        }
        if (!hasUpper(password)){
            // console.log("Contraseña debe tener mayusculas.")
            // Response.status(400).json({message: "Password must have uppercase letters"})
            return false
        }
        if(!hasDigit(password)){
            // console.log("Contraseña requiere mínimo un número.")
            // Response.status(400).json({message: "Password must have digits"})
            return false
        }
        if(!hasSpace(password)){
            // Response.status(400).json({message: "Password must not have blank spaces"})
            return false
        }
        return true
    }


//verificar el email (por ahora la regex, definir si vamos a hacer algo más :v)

 export function emailVerification(email: string){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}




