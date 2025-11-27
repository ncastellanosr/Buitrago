import  bcrypt from "bcrypt";
import { AccountTypeOptions } from "../entities/Account";
import {v4 as uuidv4} from 'uuid';
//verificar parametros de inserción
enum AccountNumberOptions{
    CASH = '5501',
    SAVINGS = '5502',
    CHECKING = '5503',
    CREDIT_CART = '5504',
    INVESTMENT = '5505',
    OTHER = '5506'
}
function hasName(name:string){
    if(!name){
        console.log("No hay nombre pana.")
        return false
    }
    return true
}
function hasBalance(balance:string){
    const balanceToInt:number = +balance;
    if(!balanceToInt){
        console.log("no hay plata.")
        return false
    } 
    if(balanceToInt<=0){
        return false
    }
    return true
}
export function accountVerification(name:string, balance:string){
    if(!hasName(name)){
        return false
    }
    if(!hasBalance(balance)){
        return false
    }
    return true
}

export function createAccountNumber( type : keyof typeof AccountTypeOptions ): string {
    const prefix = AccountNumberOptions[type];
    const uniquePart = uuidv4();
    return `${prefix}-${uniquePart}`;
}

// console.log(createAccountNumber('SAVINGS'));