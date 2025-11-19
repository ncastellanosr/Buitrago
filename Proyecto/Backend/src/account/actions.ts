import { AppDataSource } from "../database";
import { Account } from "../entities/Account";

const accountRepo = AppDataSource.getRepository(Account);
export interface Actions {

    doAction(user: undefined, account: undefined): void;
}
export class CreateAccount implements Actions {
    public async doAction(user: any, account: any){
        //create and save account
        const newAccount = accountRepo.create({
            user: user,
            accountName: account.accName,
            accountType: account.type,
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
        const getAccount = await accountRepo.findOne({ where: { user } });
        // getAccount.isActive = false;
        // await accountRepo.save(getAccount);
    }
}
