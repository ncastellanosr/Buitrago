   
import { AppDataSource } from "../database";
import { Account } from "../entities/Account";
import { Category, CategoryTypeOptions } from "../entities/Category";
   export class CreateCategory {
       public async createCategory(userData: { category: string, accountNumber: string}): Promise<string> {
        const accountRepo = AppDataSource.getRepository(Account);
        const categoryRepo = AppDataSource.getRepository(Category);
        const getAccount = await accountRepo.findOne({ where: { accountNumber:userData.accountNumber}}) 

        const newCategory = categoryRepo.create({
            name: `${userData.category} - Account Transactions ${getAccount?.accountType}`,
            categoryType: CategoryTypeOptions[userData.category as keyof typeof CategoryTypeOptions],
            description: 'Category created automatically during transaction, date: ' + new Date().toISOString(),
        });
        await categoryRepo.save(newCategory);
        return `${userData.category} - Account Transactions ${getAccount?.accountType}`
    }
}