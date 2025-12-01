import { Request, Response } from 'express';
import { AppDataSource } from '../database';
import { Reminder } from '../entities/Reminder';
import { AuthUser } from '../entities/AuthUser';

export async function createReminder(req: Request, res: Response){
    try {
        const {
            user,
            title,
        dueDate} = req.body;
        const reminderRepo = AppDataSource.getRepository(Reminder);
        const userRepo = AppDataSource.getRepository(AuthUser);
        const getUser = await userRepo.findOne( {where: {id:user} as any});
        if(!getUser){ throw new Error("Fail, user not found.")}
        const fechaReminder = new Date(dueDate);
        const newReminder = reminderRepo.create({
            user: getUser,
            title: title,
            message: `Reminder: Your obligation "${title}" is due on ${dueDate}. Please ensure timely payment.`,
            remindAt: fechaReminder,
            channelSet: { push: true, sms: false, email: false },
            isSent: false
        } as any);
        await reminderRepo.save(newReminder);
            return res.status(200).json({ message: "Create New Reminder was successful." });
    } catch (error) {
        console.error("Error in doReminder:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}
export async function getReminders(req:Request, res:Response){
    try{
        const userRepo = AppDataSource.getRepository(AuthUser);
        const reminderRepo = AppDataSource.getRepository(Reminder);
        const {email} = req.body;
        const user = await userRepo.findOne({where: {email}});
        if(!user){
            return res.status(400).json({message: "Fail, email can't get userId"});
        }
        const reminders =  await reminderRepo.find({where:{user:{id:user.id}}});
        return res.status(201).json({message:reminders});
    } catch(err){
        console.error("Fail, not able to manage account:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
}

