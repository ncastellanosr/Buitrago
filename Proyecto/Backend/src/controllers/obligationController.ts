import { Request, Response } from 'express';
import { ObligationManager } from '../obligations/obligationManager';
import { dataVerification, obligationnInsertion, reminderInsertion } from '../obligations/actions';

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