import { Actions } from "./actions";
import {AccountTypeOptions} from "../entities/Account";
import { AuthUser } from "../entities/AuthUser";
export class AccountManagement {
    /**
     * @type {Actions} Acciones que puede realizar un usario en la cuenta.
     */
    private action: Actions;
    // acción por default sería crear la cuenta del usuario
    constructor(action: Actions) {
        this.action = action;
    }
    // definir que tipo de cuenta se creará
    public setAction(setAction: Actions) {
        this.action = setAction;
    }
    //nombre tan paila
    public manageAccount(user: any, newAccount?: any) {
        return this.action.doAction(user, newAccount);
    }
}