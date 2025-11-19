import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AppDataSource } from "../database";
import { AuthUser } from "../entities/AuthUser";
import { accountVerification } from "../verification/accVerification";
import { AccountManagement } from "../account/accountmanagement";
import { CreateAccount } from "../account/actions";
// import bcrypt from "bcrypt";
dotenv.config();

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
        const accountManager = new AccountManagement(new CreateAccount());
        accountManager.manageAccount(user.id,{accName,type,currency,balance});
        return res.status(201).json({message: "Account registered successfully."});
    } catch (err) {
        console.error("Fail, not able to manage account:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
}
export async function deactivateAcc(req: Request, res: Response){

}

