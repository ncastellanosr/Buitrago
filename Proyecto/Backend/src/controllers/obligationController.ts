import { Request, Response } from 'express';
import { ObligationManager } from '../obligations/obligationManager';
import { dataVerification, obligationnInsertion, reminderInsertion } from '../obligations/actions';
import { AuthUser } from '../entities/AuthUser';
import { AppDataSource } from '../database';
import { Account } from '../entities/Account';
import { Obligation } from '../entities/Obligation';

export function doObligation(req: Request, res: Response){
    try {
    const {user, 
        title, 
        amountTotal,
        amountRemaining, 
        currency, 
        dueDate, 
        frequency, 
        state} = req.body;
        const obligationManager = new ObligationManager(new dataVerification());
        obligationManager.manageObligations(user, 
            title, 
            amountTotal, 
            amountRemaining,    
            currency, 
            dueDate,
            frequency,
            state);
        if(!obligationManager){
            return res.status(400).json({ message: "Fail, invalid obligation data." });
        }
        obligationManager.setAction(new obligationnInsertion());
        obligationManager.manageObligations(user,
            title, 
            amountTotal, 
            amountRemaining,    
            currency, 
            dueDate,
            frequency,
            state);
        // obligationManager.setAction(new reminderInsertion());
        // obligationManager.manageObligations(user,
        //     title, 
        //     amountTotal, 
        //     amountRemaining,    
        //     currency, 
        //     dueDate,
        //     frequency,
        //     state);
        return res.status(200).json({ message: "Create New Obligation was successful." });
    } catch (error) {
        console.error("Error in doObligation:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}
export function doReminder(req: Request, res: Response){
    try {
    const {user,
        title,
        dueDate} = req.body;
        const obligationManager = new ObligationManager(new reminderInsertion());
        obligationManager.manageObligations(user,
            title, 
            dueDate, 
            "",    
            "", 
            "",
            "ONE_TIME",
            "OPEN");
        return res.status(200).json({ message: "Create New Reminder was successful." });
    } catch (error) {
        console.error("Error in doReminder:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}
export async function getObligations(req:Request, res:Response){
    try{
        const userRepo = AppDataSource.getRepository(AuthUser);
        const obligationRepo = AppDataSource.getRepository(Obligation);
        const {email} = req.body;
        const user = await userRepo.findOne({where: {email}});
        if(!user){
            return res.status(400).json({message: "Fail, email can't get userId"});
        }
        const obligations =  await obligationRepo.find({where:{user:{id:user.id}}});
        return res.status(201).json({message:obligations});
    } catch(err){
        console.error("Fail, not able to manage account:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
}
export async function obligationCount(req:Request, res:Response){
    try{
        const userRepo = AppDataSource.getRepository(AuthUser);
        const obligationRepo = AppDataSource.getRepository(Obligation);
        const {email} = req.body;
        const user = await userRepo.findOne({where: {email}});
        if(!user){
            return res.status(400).json({message: "Fail, email can't get userId"});
        }
        const obligationCount = await obligationRepo.count({where:{user:{id:user.id}}});
        return res.status(201).json({message:obligationCount});
    }catch(err){
        console.error("Fail, not able to manage account:", err);
        return res.status(500).json({ message: "Internal server error." });     
    }

}