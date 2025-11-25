import { VerificationCommand } from "./command";
import { DataChecker } from "./datachacker";
// user,
// accountOne,
// accountTwo,
// category,
// amountOne,
// amountTwo
        const {user, 
            accountOne, 
            accountTwo, 
            category, 
            amountOne, 
            amountTwo, 
            currency, 
            description} = {user:"1",
            accountOne:"5502-e575470c-6179-4fe5-a122-f80c59e0cc71",
            accountTwo:"5502-9733f9b6-a4f0-43ff-867c-1bae4fd760f1",
            category:"EXPENSE",
            amountOne:"1000",
            amountTwo:"500",
            currency:"USD",
            description:"Test transaction"};
// const dataTested:{user:string,
//     accountOne:string,
//     accountTwo:string,
//     category:string,
//     amountOne:string,
//     amountTwo:string} = {
//         user:"1",
//         accountOne:"5502-d374dabb-b3bd-47f8-bbb8-c889e5e43077",
//         accountTwo:"5502-9733f9b6-a4f0-43ff-867c-1bae4fd760f1",
//         category:"EXPENSE",
//         amountOne:"1000",
//         amountTwo:"500"};

describe("Cuenta", async () => {
    //   beforeEach(() => {
        //     // limpiar estado compartido entre tests
        //     user.account = [];
        //   });
        test("Probar función de operaciones", () => {
        const dataChecker = new DataChecker();
        const verificationCommand = new VerificationCommand(
            dataChecker,
            user,
            accountOne,
            accountTwo,
            category,
            amountOne,
            amountTwo
        );
        expect(verificationCommand.execute()).toBe(true);
        })});