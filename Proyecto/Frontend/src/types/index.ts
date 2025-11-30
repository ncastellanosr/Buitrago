export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  suggestedPercentage: number;
  subcategories: string[];
}

export interface AccountCategory {
  CASH:string,
  SAVINGS:string,
  CHECKING:string,
  CREDIT_CART:string,
  INVESTMENT:string,
  OTHER:string
}
export interface IncomeCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface BudgetEntry {
  categoryId: string;
  amount: number;
  description?: string;
}

export interface BudgetData {
  income: BudgetEntry[];
  expenses: BudgetEntry[];
  totalIncome: number;
  totalExpenses: number;
  availableMoney: number;
  availablePercentage: number;
}

export interface FinancialInstrument {
  id: string;
  name?: string;
  type?: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
}

export interface CDT extends FinancialInstrument {
  bank: string;
  interestRate: number;
  term: number;
  minimumAmount: number;
}

export interface Bond extends FinancialInstrument {
  yield: number;
  maturity: string;
  minimumAmount: number;
}

export interface RealEstate extends FinancialInstrument {
  type: string;
  location: string;
  averagePrice: number;
  pricePerM2: number;
  expectedReturn: number;
}

export interface Stock extends FinancialInstrument {
  symbol: string;
  sector: string;
  riskLevel: string;
  currentPrice?: number;
  change?: number;
  changePercent?: number;
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage?: string;
}

export interface FinancialTerm {
  definition: string;
  explanation: string;
  example: string;
}

export interface EducationalContent {
  terms: Record<string, FinancialTerm>;
  categories: Record<string, string[]>;
}
