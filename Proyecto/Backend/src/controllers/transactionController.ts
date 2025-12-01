import { Request, Response } from "express"
// import { OperationCommand, VerificationCommand, InsertionCommand, CreateCategoryCommand }  from "../transaction/command";
import { AppDataSource } from "../database";
import { TransactionTbl } from "../entities/TransactionTbl";
import { Account } from "../entities/Account";
import { Operation } from "../verification/transactionVerification";
import { TransactionManager } from "../transaction/transactionManager";
import { DataChecker, InsertionTransaction, UpdateAccount } from "../transaction/actions"
import { CreateCategory } from "../transaction/createCategory"
import { AuthUser } from "../entities/AuthUser";

export async function makeTransaction(req: Request, res: Response){
    // "email","accountOne","accountTwo","category","amountOne","amountTwo","currency","description"
    try{
        const userRepo = AppDataSource.getRepository(Account);
        const transactionRepo = AppDataSource.getRepository(TransactionTbl);
        const accountRepo = AppDataSource.getRepository(Account);
        const {email, 
            accountOne, 
            accountTwo, 
            category, 
            amountOne, 
            amountTwo, 
            currency, 
            description} = req.body;
            
        const accountManager = new TransactionManager(new DataChecker());
        let action = "transaction_verification";
        const verifier = await accountManager.manageTransaction(email, accountOne, accountTwo, category, amountOne, amountTwo, currency, description,action);
        if(!verifier){
            return res.status(400).json({ message: "Fail, invalid transaction data." });
        }
        //actualizar balances de las cuentas y totalizar operación.
        const newAmountPrimary = await Operation(accountOne, amountOne,"0", "sub");
        let newAmountSecondary = "0";
        if(accountTwo){
            newAmountSecondary = await Operation(accountTwo, amountTwo, "0", "sub");
        }
        const transactionTotal = await Operation(accountOne, amountOne, amountTwo, "sum");

        // new category
        const newCategory = new CreateCategory();
        action = await newCategory.createCategory({ category, accountNumber: accountOne });
        
        // //insertion
        accountManager.setAction(new InsertionTransaction());
        await accountManager.manageTransaction(email, accountOne, accountTwo, category, transactionTotal, amountTwo, currency, description, action);
        
        //update account balances
        accountManager.setAction(new UpdateAccount());
        await accountManager.manageTransaction(email, accountOne, accountTwo, category, newAmountPrimary, newAmountSecondary, currency, description, action);
        return res.status(200).json({ message: "Transaction was successful.", newAmountPrimary, newAmountSecondary, transactionTotal });

    } catch (err){
        console.error("Fail, not able to manage transaction:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
}
export async function transactionCount(req:Request, res:Response){
    try{
        const userRepo = AppDataSource.getRepository(AuthUser);
        const accountRepo = AppDataSource.getRepository(Account);
        const transactionRepo = AppDataSource.getRepository(TransactionTbl);
        const {email} = req.body;
        const user = await userRepo.findOne({where: {email}});
        if(!user){
            return res.status(400).json({message: "Fail, email can't get userId"});
        }
        const getAccounts = await accountRepo.find({where:{user:{id:user.id},isActive:true}});
        const accountIds = getAccounts.map(acc => acc.id);
        let contador = 0;
        for(const accId of accountIds){
            const transactionCount = await transactionRepo.count({where:{account:{id:accId}}});
            contador = contador + +(transactionCount);
        }
        return res.status(201).json({message:contador});
    }catch(err){
        console.error("Fail, not able to manage account:", err);
        return res.status(500).json({ message: "Internal server error." });     
    }

}
export async function getTransactions(req:Request, res:Response){
    try{
        const userRepo = AppDataSource.getRepository(AuthUser);
        const accountRepo = AppDataSource.getRepository(Account);
        const transactionRepo = AppDataSource.getRepository(TransactionTbl);
        const {email} = req.body;
        const user = await userRepo.findOne({where: {email}});
        if(!user){
            return res.status(400).json({message: "Fail, email can't get userId"});
        }
        const getAccounts = await accountRepo.find({where:{user:{id:user.id},isActive:true}});
        const accountIds = getAccounts.map(acc => acc.id);
        let transactions = [];
        for(const accId of accountIds){
            const getTransactions = await transactionRepo.find({where:{account:{id:accId}}});
            for(const transaction of getTransactions){
                transactions.push(transaction);
            }
        }
        return res.status(201).json({message:transactions});
    } catch(err){
        console.error("Fail, not able to manage account:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
}