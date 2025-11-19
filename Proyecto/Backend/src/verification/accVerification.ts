//verificar parametros de inserción
function hasName(name:string){
    if(!name){
        console.log("No hay nombre pana.")
        return false
    }
    return true
}
function hasBalance(balance:string){
    const balanceToInt:number = +balance;
    if(!balanceToInt){
        console.log("no hay plata.")
        return false
    } 
    if(balanceToInt<=0){
        return false
    }
    return true
}
export function accountVerification(name:string, balance:string){
    if(!hasName(name)){
        return false
    }
    if(!hasBalance(balance)){
        return false
    }
    return true
}