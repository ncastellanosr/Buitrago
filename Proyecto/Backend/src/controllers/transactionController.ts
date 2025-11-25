import { Request, Response } from "express"
// import { OperationCommand, VerificationCommand, InsertionCommand, CreateCategoryCommand }  from "../transaction/command";
import { AppDataSource } from "../database";
import { TransactionTbl } from "../entities/TransactionTbl";
import { Account } from "../entities/Account";
import { Operation } from "../verification/transactionVerification";
import { TransactionManager } from "../transaction/transactionManager";
import { DataChecker, InsertionTransaction } from "../transaction/actions"
import { CreateCategory } from "../transaction/createCategory"

export async function doTransaction(req: Request, res: Response){
    try{
        const userRepo = AppDataSource.getRepository(Account);
        const transactionRepo = AppDataSource.getRepository(TransactionTbl);
        const accountRepo = AppDataSource.getRepository(Account);
        const {user, 
            accountOne, 
            accountTwo, 
            category, 
            amountOne, 
            amountTwo, 
            currency, 
            description} = req.body;
            
        const accountManager = new TransactionManager(new DataChecker());
        let action = "transaction_verification";
        const verifier = await accountManager.manageTransaction(user, accountOne, accountTwo, category, amountOne, amountTwo, currency, description,action);
        if(!verifier){
            return res.status(400).json({ message: "Fail, invalid transaction data." });
        }
        //actualizar balances de las cuentas y totalizar operación.
        const newAmountPrimary = await Operation(accountOne, amountOne,"0", "sub");
        if(accountTwo){
            const newAmountSecondary = await Operation(accountTwo, amountTwo, "0", "sub");
        }
        const transactionTotal = await Operation(accountOne, amountOne, amountTwo, "sum");

        // new category
        const newCategory = new CreateCategory();
        action = await newCategory.createCategory({ category, accountNumber: accountOne });
        
        // //insertion
        accountManager.setAction(new InsertionTransaction());
        await accountManager.manageTransaction(user, accountOne, accountTwo, category, transactionTotal, amountTwo, currency, description, action);
        return res.status(200).json({ message: "Transaction was successful.", transactionTotal });

    } catch (err){
        console.error("Fail, not able to manage transaction:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
}