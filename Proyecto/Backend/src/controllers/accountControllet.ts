import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AppDataSource } from "../database";
import { AuthUser } from "../entities/AuthUser";
import { accountVerification, createAccountNumber } from "../verification/accVerification";
import { AccountManagement } from "../account/accountmanagement";
import { CreateAccount, DeactivateAccount } from "../account/actions";
import { Account, AccountTypeOptions } from "../entities/Account";
// import bcrypt from "bcrypt";
dotenv.config();
//Arquitectura Strategy, es mi primera vez aplicándola (no me funen :c)
export async function createAcc(req: Request, res: Response){
    try{
        const userRepo = AppDataSource.getRepository(AuthUser);
        const { email, accName, type, currency, balance } = req.body;

        //verify user (Aunque no tiene sentido si el user ya hizo login, estoy comprobando funcionalidades)
        const user = await userRepo.findOne({ where: { email }});
        if(!user) {
            return res.status(400).json({message: "Fail, email can't get userId"});
        }
        // Auth token, con esto ya podemos quitar lo de arriba
        // InsertAccount
        if (!accountVerification(accName,balance)) {
            return res.status(400).json({ message: "Datos incompletos, inserción abortade."})
        }
        const accountUUID = createAccountNumber(type);
        const accountManager = new AccountManagement(new CreateAccount());
        accountManager.manageAccount(user.id,{accName,type,accountUUID,currency,balance}); 
        return res.status(201).json({message: "Account registered successfully.", accountUUID:accountUUID});
    } catch (err) {
        console.error("Fail, not able to manage account:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
}
export async function deactivateAcc(req: Request, res: Response){
    try{
        const userRepo = AppDataSource.getRepository(AuthUser);
        const { email, accountNumber} = req.body;
        const user = await userRepo.findOne({ where: { email }});
        if(!user) {
            return res.status(400).json({message: "Fail, email can't get userId"});
        }
        const accountManager = new AccountManagement(new DeactivateAccount());
        accountManager.manageAccount(user,accountNumber);
        return res.status(201).json({message: "Account deactivated successfully.", user: {id:user.id, email:email, acc:accountNumber}});
    }catch (err){
        console.error("Fail, not able to manage account:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
}
export async function getAccounts(req:Request, res:Response){
    try{
        const userRepo = AppDataSource.getRepository(AuthUser);
        const accountRepo = AppDataSource.getRepository(Account);
        const {email} = req.body;
        const user = await userRepo.findOne({where: {email}});
        if(!user){
            return res.status(400).json({message: "Fail, email can't get userId"});
        }
        const accounts =  await accountRepo.find({where:{user:{id:user.id},isActive:true}});
        return res.status(201).json({message:accounts});
    } catch(err){
        console.error("Fail, not able to manage account:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
}

export async function accountCount(req:Request, res:Response){
    try{
        const userRepo = AppDataSource.getRepository(AuthUser);
        const accountRepo = AppDataSource.getRepository(Account);
        const {email} = req.body;
        const user = await userRepo.findOne({where: {email}});
        if(!user){
            return res.status(400).json({message: "Fail, email can't get userId"});
        }
        const accountCount = await accountRepo.count({where:{user:{id:user.id},isActive:true}});
        return res.status(201).json({message:accountCount});
    }catch(err){
        console.error("Fail, not able to manage account:", err);
        return res.status(500).json({ message: "Internal server error." });     
    }

}

