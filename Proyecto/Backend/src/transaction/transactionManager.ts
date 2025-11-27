import { Actions } from "./actions"
import {AccountTypeOptions} from "../entities/Account";
import { AuthUser } from "../entities/AuthUser";
export class TransactionManager {
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
    public manageTransaction(user:string,
        accountOne:string, 
        accountTwo:string, 
        category:string, 
        amountOne:string, 
        amountTwo:string, 
        currency:string,
        description:string,
        action:string ) {
        return this.action.doAction(user, accountOne, accountTwo, category, amountOne, amountTwo, currency, description, action);
    }
}