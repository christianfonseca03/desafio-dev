import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  Category,
  CreateTransactionInput,
  Transaction,
  TransactionWithSign,
} from "@/types/dashboard";

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function useDashboardData() {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const categoryById = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category.name]));
  }, [categories]);

  const transactionsWithSign = useMemo<TransactionWithSign[]>(() => {
    return transactions.map((transaction) => {
      const amount = Number(transaction.amount);
      const normalized = Math.abs(amount);
      const signed = transaction.type === "EXPENSE" ? -normalized : normalized;
      return { ...transaction, signedAmount: signed };
    });
  }, [transactions]);

  const totalBalance = useMemo(() => {
    return transactionsWithSign.reduce((acc, transaction) => {
      return acc + transaction.signedAmount;
    }, 0);
  }, [transactionsWithSign]);

  const balanceByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const transaction of transactionsWithSign) {
      const current = map.get(transaction.categoryId) ?? 0;
      map.set(transaction.categoryId, current + transaction.signedAmount);
    }
    return map;
  }, [transactionsWithSign]);

  const apiFetch = useCallback(
    async (path: string, init?: RequestInit) => {
      const token = await getToken();
      if (!token) {
        throw new Error("Não autenticado");
      }
      const headers = new Headers(init?.headers ?? {});
      headers.set("Authorization", `Bearer ${token}`);
      if (init?.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
      const response = await fetch(`${apiBase}${path}`, {
        ...init,
        headers,
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Erro ao comunicar com a API");
      }
      return response.json();
    },
    [getToken],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const [loadedCategories, loadedTransactions] = await Promise.all([
        apiFetch("/categories"),
        apiFetch("/transactions"),
      ]);
      setCategories(loadedCategories);
      setTransactions(loadedTransactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateCategory = useCallback(
    async (name: string) => {
      if (!name.trim()) {
        return false;
      }
      setError("");
      setSuccessMessage("");
      try {
        await apiFetch("/categories", {
          method: "POST",
          body: JSON.stringify({ name: name.trim() }),
        });
        await loadData();
        setSuccessMessage("Categoria criada com sucesso.");
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao criar categoria");
        setSuccessMessage("");
        return false;
      }
    },
    [apiFetch, loadData],
  );

  const handleCreateTransaction = useCallback(
    async (input: CreateTransactionInput) => {
      const amount = Number(input.amount);
      if (!input.categoryId || Number.isNaN(amount)) {
        return false;
      }
      if (input.type === "INCOME" && amount <= 0) {
        setError("Entradas devem ser valores positivos.");
        setSuccessMessage("");
        return false;
      }
      if (input.type === "EXPENSE" && amount >= 0) {
        setError("Saídas devem ser valores negativos.");
        setSuccessMessage("");
        return false;
      }
      setError("");
      setSuccessMessage("");
      try {
        await apiFetch("/transactions", {
          method: "POST",
          body: JSON.stringify({
            categoryId: input.categoryId,
            type: input.type,
            amount,
            date: input.date,
            description: input.description || undefined,
          }),
        });
        await loadData();
        setSuccessMessage("Movimentação criada com sucesso.");
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao criar transação");
        setSuccessMessage("");
        return false;
      }
    },
    [apiFetch, loadData],
  );

  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      setError("");
      setSuccessMessage("");
      try {
        await apiFetch(`/categories/${categoryId}`, { method: "DELETE" });
        await loadData();
        setSuccessMessage("Categoria removida com sucesso.");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao remover categoria",
        );
        setSuccessMessage("");
      }
    },
    [apiFetch, loadData],
  );

  const handleDeleteTransaction = useCallback(
    async (transactionId: string) => {
      setError("");
      setSuccessMessage("");
      try {
        await apiFetch(`/transactions/${transactionId}`, { method: "DELETE" });
        await loadData();
        setSuccessMessage("Movimentação removida com sucesso.");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao remover transação",
        );
        setSuccessMessage("");
      }
    },
    [apiFetch, loadData],
  );

  return {
    loading,
    error,
    successMessage,
    categories,
    transactionsWithSign,
    categoryById,
    totalBalance,
    balanceByCategory,
    handleCreateCategory,
    handleCreateTransaction,
    handleDeleteCategory,
    handleDeleteTransaction,
  };
}
