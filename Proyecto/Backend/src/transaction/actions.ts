import { AppDataSource } from "../database";
import { Account } from "../entities/Account";
import { AuthUser } from "../entities/AuthUser";
import { Category } from "../entities/Category";
import { TransactionTbl, TransactionType } from "../entities/TransactionTbl";

const accountRepo = AppDataSource.getRepository(Account);
const userRepo = AppDataSource.getRepository(AuthUser);
export interface Actions {

    doAction(user:string,
            accountOne:string, 
            accountTwo:string, 
            category:string, 
            amountOne:string, 
            amountTwo:string, 
            currency:string,
            description:string,
            action:string): Promise<boolean> | Promise <void> | string;
}
export class DataChecker implements Actions{        
            // user: string, 
            // accountOne:string, 
            // accountTwo:string, 
            // category:string, 
            // amountOne:string, 
            // amountTwo:string, 
            // currency:string, 
            // description:string  

    async hasUser(user:any): Promise<boolean> {
        if (!user) return false;
        const found = await userRepo.findOne({ where: { id: user } as any });
        return !!found;
    }
    async hasAccount(accountOne:any, accountTwo:any): Promise<boolean> {
        if(accountTwo){
            const getAccountTwo = await accountRepo.findOne({ where: { accountNumber:accountTwo}})
            if(accountTwo!=getAccountTwo?.accountNumber){
                return false
            }
        }
        const getAccount = await accountRepo.findOne({ where: { accountNumber:accountOne}})
        if(accountOne!=getAccount?.accountNumber){
            return false
        }
        return true
    }
    async hasAmount(amountOne:string, account:string){
    const getAccount = await accountRepo.findOne( { where: { accountNumber:account}})
    if(!getAccount){
        return false
    }
    const amount = +getAccount?.cachedBalance - +amountOne;
    if(amount<=0){
        return false
    }
    return true
    }

    public hasCategory(category:string): boolean {
        if(!category){
            return false
        }
        return true;
    }

    async doAction(user:string,
            accountOne:string, 
            accountTwo:string, 
            category:string, 
            amountOne:string, 
            amountTwo:string, 
            currency:string,
            description:string,
            action:string): Promise<boolean> {
        if (!await this.hasUser(user)) { return false; }
        if (!await this.hasAccount(accountOne, accountTwo)) { return false; }
        if (!await this.hasAmount(amountOne, accountOne)) { return false; }
        if(accountTwo){
            if(!await this.hasAmount(amountTwo, accountTwo)) { return false; }
        }
        if (!this.hasCategory(category)) { return false; }
        return true;
    }

}

export class Operation implements Actions {
    
    public doAction(user:string,
            accountOne:string, 
            accountTwo:string, 
            category:string, 
            amountOne:string, 
            amountTwo:string, 
            currency:string,
            description:string,
            action:string ): string {
        if(action==='sum'){
            const amount = +amountOne + +amountTwo;
            return amount.toString();
        }
        else{
            const amount = +amountOne - +amountTwo;
            return amount.toString();
        }
    }
}

export class InsertionTransaction implements Actions {
    public async doAction(user:string,
            accountOne:string, 
            accountTwo:string, 
            category:string, 
            amountOne:string, 
            amountTwo:string, 
            currency:string,
            description:string,
            action:string ): Promise<void> {
        const accountRepo = AppDataSource.getRepository(Account);
        const transactionRepo = AppDataSource.getRepository(TransactionTbl);
        const getAccountOne = await accountRepo.findOne({ where: { accountNumber: accountOne } as any});
        const getAccountTwo = await accountRepo.findOne({ where: { accountNumber: accountTwo } as any});
        const getCategory = await AppDataSource.getRepository(Category).findOne({ where: { name: action } as any});
        if (!getAccountOne || !getAccountTwo || !getCategory) {
            throw new Error("Account or category not found");
        }
        const newTransaction = transactionRepo.create({
            account: getAccountOne,
            relatedAccount: getAccountTwo,
            category: getCategory,
            transactionType: TransactionType.EXPENSE,
            amount: Number(amountOne),
            currency: 'USD',
            description: "Transaction successful",
            ocurredAt: new Date(),
            createdAt: new Date(),
            isReconciled: true,
        } as any);
        await transactionRepo.save(newTransaction);
    }
}