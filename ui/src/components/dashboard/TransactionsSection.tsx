import { useEffect, useState, type FormEvent } from "react";
import type { TransactionsSectionProps } from "@/types/dashboard";

export default function TransactionsSection({
  loading,
  categories,
  transactions,
  categoryById,
  onCreateTransaction,
  onDeleteTransaction,
}: TransactionsSectionProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [transactionCategoryId, setTransactionCategoryId] = useState("");
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">(
    "INCOME",
  );
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [transactionDescription, setTransactionDescription] = useState("");

  useEffect(() => {
    const hasCategory = categories.some(
      (category) => category.id === transactionCategoryId,
    );
    if (!transactionCategoryId || !hasCategory) {
      setTransactionCategoryId(categories[0]?.id ?? "");
    }
  }, [categories, transactionCategoryId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = await onCreateTransaction({
      categoryId: transactionCategoryId,
      type: transactionType,
      amount: Number(transactionAmount),
      date: transactionDate,
      description: transactionDescription || undefined,
    });
    if (success) {
      setTransactionAmount("");
      setTransactionDescription("");
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-gray-900">Movimentações</h2>
      <form
        className="mt-4 grid gap-3 md:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <select
          value={transactionCategoryId}
          onChange={(event) => setTransactionCategoryId(event.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
        >
          <option value="">Selecione a categoria</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={transactionType}
          onChange={(event) =>
            setTransactionType(event.target.value as "INCOME" | "EXPENSE")
          }
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
        >
          <option value="INCOME">Entrada</option>
          <option value="EXPENSE">Saída</option>
        </select>
        <input
          value={transactionAmount}
          onChange={(event) => setTransactionAmount(event.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
          placeholder="Valor"
          type="number"
          step="0.01"
        />
        <p className="text-xs text-gray-500 md:col-span-2">
          Use valores positivos para entradas e negativos para saídas.
        </p>
        <input
          value={transactionDate}
          onChange={(event) => setTransactionDate(event.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
          type="date"
          max={today}
        />
        <input
          value={transactionDescription}
          onChange={(event) => setTransactionDescription(event.target.value)}
          className="md:col-span-2 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
          placeholder="Descrição (opcional)"
        />
        <button
          type="submit"
          className="md:col-span-2 cursor-pointer rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Adicionar movimentação
        </button>
      </form>
      <div className="mt-6 space-y-3 text-sm text-gray-700">
        {loading ? (
          <p>Carregando...</p>
        ) : transactions.length ? (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-md border border-gray-100 px-3 py-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">
                  {transaction.type === "INCOME" ? "Entrada" : "Saída"}
                </span>
                <div className="flex items-center gap-3">
                  <span>
                    {transaction.signedAmount.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Tem certeza que deseja excluir esta movimentação?",
                      );
                      if (confirmed) {
                        onDeleteTransaction(transaction.id);
                      }
                    }}
                    className="cursor-pointer rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
              <div className="text-gray-500">
                {categoryById.get(transaction.categoryId) ??
                  "Categoria removida"}
              </div>
              <div className="text-gray-500">
                {new Date(transaction.date).toLocaleDateString("pt-BR")}
              </div>
              {transaction.description ? (
                <div className="text-gray-500">{transaction.description}</div>
              ) : null}
            </div>
          ))
        ) : (
          <p>Nenhuma movimentação cadastrada.</p>
        )}
      </div>
    </section>
  );
}
