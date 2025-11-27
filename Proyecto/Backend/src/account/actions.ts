import { AppDataSource } from "../database";
import { Account } from "../entities/Account";

const accountRepo = AppDataSource.getRepository(Account);
export interface Actions {

    doAction(user: any, account: any): Promise<void>;
}
export class CreateAccount implements Actions {
    public async doAction(user: any, account: any){
        const newAccount = accountRepo.create({
            user: user,
            accountName: account.accName,
            accountType: account.type,
            accountNumber: account.accountUUID,
            accountCurrency: account.currency,
            createdAt: new Date(),
            isActive: true,
            cachedBalance: account.balance
        });
        await accountRepo.save(newAccount);
    }
}
// tengo sueño lo completo más tarde :'c
export class DeactivateAccount implements Actions {
    public async doAction(user: any, account: any) {
        const existingAccount = await accountRepo.findOneBy({user:{id:user.id}, accountName: account.accName });
        if(!existingAccount){
            return console.log("F no sirvió")
        }
        existingAccount.isActive = false;
        await accountRepo.save(existingAccount);
    }
}
