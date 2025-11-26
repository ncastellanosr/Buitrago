import { AppDataSource } from "../database";
import { Account } from "../entities/Account";

    export async function Operation(accountNumber:string, amount:string, secondAmount:string, action:string): Promise<string> {
        const accountRepo = AppDataSource.getRepository(Account)
        const getAccount = await accountRepo.findOne({ where: { accountNumber:accountNumber}})
        if(!getAccount){
            throw new Error("Account not found");
        }
        if(action==='sum'){
            const newAmount = +amount + +secondAmount;
            return newAmount.toString();
        }
        else{
            const newAmount = +getAccount.cachedBalance - +amount;
            return newAmount.toString();
        }
    }