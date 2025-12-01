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
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
    TRANSFER = 'TRANSFER',
    OTHER='OTHER'
}

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn('increment', {type:'bigint'})
    id: number;
    
    @Column({ type: 'varchar', length: 100})
    name: string;
    
    @Column({ 
        type: 'enum',
        enum: CategoryTypeOptions,
        default: CategoryTypeOptions.OTHER,
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