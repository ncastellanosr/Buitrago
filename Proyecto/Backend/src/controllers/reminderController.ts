import { Request, Response } from 'express';
import { ObligationManager } from '../obligations/obligationManager';
import { reminderInsertion } from '../obligations/actions';

export async function createReminder(req: Request, res: Response){
    try {
        const {
        user,
        title,
        dueDate} = req.body;
        const obligationManager = new ObligationManager(new reminderInsertion());
        obligationManager.manageObligations(
            user,
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

