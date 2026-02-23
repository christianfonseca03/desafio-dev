export type Category = {
  id: string;
  name: string;
};

export type Transaction = {
  id: string;
  categoryId: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: string;
  description?: string | null;
};

export type TransactionWithSign = Transaction & { signedAmount: number };

export type BalanceSummaryProps = {
  totalBalance: number;
};

export type CreateCategoryHandler = (name: string) => Promise<boolean>;

export type CreateTransactionInput = {
  categoryId: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: string;
  description?: string;
};

export type CreateTransactionHandler = (
  input: CreateTransactionInput,
) => Promise<boolean>;

export type DeleteCategoryHandler = (categoryId: string) => Promise<void>;

export type DeleteTransactionHandler = (transactionId: string) => Promise<void>;

export type CategorySectionProps = {
  loading: boolean;
  categories: Category[];
  balanceByCategory: Map<string, number>;
  onCreateCategory: CreateCategoryHandler;
  onDeleteCategory: DeleteCategoryHandler;
};

export type TransactionsSectionProps = {
  loading: boolean;
  categories: Category[];
  transactions: TransactionWithSign[];
  categoryById: Map<string, string>;
  onCreateTransaction: CreateTransactionHandler;
  onDeleteTransaction: DeleteTransactionHandler;
};
