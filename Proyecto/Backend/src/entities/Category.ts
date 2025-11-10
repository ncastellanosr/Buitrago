import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany
} from "typeorm";
import { TransactionTbl } from "./TransactionTbl";
import { Budget } from "./Budget";

export enum CategoryTypeOptions {
    INCOME = 'income',
    EXPENSE = 'expense',
    TRANSFER = 'transfer',
    OTHER='other'
}

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn('increment', {type:'bigint'})
    id: number;
    
    @Column({ type: 'varchar', length: 100, unique: true})
    name: string;
    
    @Column({ 
        type: 'enum',
        enum: CategoryTypeOptions,
        default: CategoryTypeOptions.OTHER,
        unique: true
    })
    categoryType: CategoryTypeOptions;
    
    @ManyToOne((type) => Category, (category) => category.childCategories)
    parentCategory: Category

    @OneToMany((type) => Category, (category) => category.parentCategory)
    childCategories: Category[]

    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string;

    @OneToMany(() => TransactionTbl, (transaction) => transaction.category)
    transaction: TransactionTbl[]

    @OneToMany(() => Budget, (budget) => budget.category)
    budget: Budget[]

}