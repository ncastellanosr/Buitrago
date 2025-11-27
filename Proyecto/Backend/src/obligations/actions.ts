import { AppDataSource } from "../database";
import { AuthUser } from "../entities/AuthUser";
import { Frequency, Obligation, State } from "../entities/Obligation";
import { Reminder } from "../entities/Reminder";

export interface Actions {
    doAction(user:string, 
        title:string, 
        amountTotal:string, 
        amountRemaining:string, 
        currency:string, 
        dueDate:string, 
        frequency: keyof typeof Frequency, 
        state: keyof typeof State):Promise<void> | Promise<boolean>;
}
export class dataVerification implements Actions {
    public async doAction(user:string, 
    title:string, 
    amountTotal:string, 
    dueDate:string): Promise<boolean> {
        const userRepo = AppDataSource.getRepository(AuthUser);
        const getUser = await userRepo.findOne( {where: {id:user} as any});
        if(!getUser){ throw new Error("Fail, user not found.")}
        if(!title){return false}
        if(!amountTotal){return false}
        if(!dueDate){return false}
        const fechaPrevista = new Date(dueDate);
        const fechaMinima = new Date();
        fechaMinima.setHours(0, 0, 0, 0);
        fechaMinima.setMonth(fechaMinima.getMonth() + 1);
        if(fechaPrevista < fechaMinima){ return false;}
        return true;
    }
}

export class obligationnInsertion implements Actions {
    public async doAction(user:string,
    title:string,
    amountTotal:string,
    amountRemaining:string,
    currency:string,
    dueDate:string,
    frequency: keyof typeof Frequency,
    state: keyof typeof State): Promise<void> {
        const obligationRepo = AppDataSource.getRepository(Obligation);
        const userRepo = AppDataSource.getRepository(AuthUser);
        const getUser = await userRepo.findOne( {where: {id:user} as any});
        if(!getUser){ throw new Error("Fail, user not found.")}
        const fecha = new Date(dueDate);
        const newObligation = obligationRepo.create({
            user: getUser,
            title: title,
            amountTotal: amountTotal,
            amountRemaining: amountRemaining,
            currency: currency,
            dueDate: fecha,
            frequency: Frequency[frequency],
            state: State[state]
        } as any);
        await obligationRepo.save(newObligation);
    }
}

export class reminderInsertion implements Actions {
    //Reminder: user, account, obligation, title, message, remindAt, channelSet, isSent (nunca me acuerdo de los parametros, no me funen)
    public async doAction(user:string,
    title:string,
    dueDate:string): Promise<void> {
        const obligationRepo = AppDataSource.getRepository(Obligation);
        const userRepo = AppDataSource.getRepository(AuthUser);
        const reminderRepo = AppDataSource.getRepository(Reminder);
        const getUser = await userRepo.findOne( {where: {id:user} as any});
        if(!getUser){ throw new Error("Fail, user not found.")}
        const getObligation = await obligationRepo.findOne( {where: {title:title, user: {id: getUser.id}}});
        if(!getObligation){ throw new Error("Fail, obligation not found." + getUser.id);}
        const fechaReminder = new Date(dueDate);
        fechaReminder.setDate(fechaReminder.getDate()-5);
        const newReminder = reminderRepo.create({
            user: getUser,
            obligation: getObligation,
            title: `Reminder for Obligation: ${title}`,
            message: `Reminder: Your obligation "${title}" is due on ${dueDate}. Please ensure timely payment.`,
            remindAt: fechaReminder,
            channelSet: { push: true, sms: false, email: false },
            isSent: false
        } as any);
        await reminderRepo.save(newReminder);
    }
}
