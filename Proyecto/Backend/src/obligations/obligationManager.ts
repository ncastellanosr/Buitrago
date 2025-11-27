import { Actions } from "./actions"
import {AccountTypeOptions} from "../entities/Account";
import { AuthUser } from "../entities/AuthUser";
import { Frequency, State } from "../entities/Obligation";
export class ObligationManager {
    /**
     * @type {Actions} Acciones que puede realizar
     */
    private action: Actions;
    constructor(action: Actions) {
        this.action = action;
    }
    public setAction(setAction: Actions) {
        this.action = setAction;
    }
    //nombre tan paila
    public manageObligations(user:string, 
        title:string, 
        amountTotal:string, 
        amountRemaining:string, 
        currency:string, 
        dueDate:string, 
        frequency:keyof typeof Frequency,
        state:keyof typeof State){
        return this.action.doAction(user, 
            title, 
            amountTotal, 
            amountRemaining,    
            currency, 
            dueDate, 
            frequency, 
            state);
    }
}