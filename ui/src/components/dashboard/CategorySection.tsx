import { useEffect, useState, type FormEvent } from "react";
import type { CategorySectionProps } from "@/types/dashboard";

export default function CategorySection({
  loading,
  categories,
  onCreateCategory,
  onDeleteCategory,
  balanceByCategory,
}: CategorySectionProps) {
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (
      selectedCategoryId &&
      !categories.some((category) => category.id === selectedCategoryId)
    ) {
      setSelectedCategoryId(null);
    }
  }, [categories, selectedCategoryId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const success = await onCreateCategory(categoryName);
    if (success) {
      setCategoryName("");
    }
  };

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-gray-900">Categorias</h2>
      <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
        <input
          value={categoryName}
          onChange={(event) => setCategoryName(event.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
          placeholder="Nova categoria"
        />
        <button
          type="submit"
          className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white"
        >
          Adicionar
        </button>
      </form>
      <div className="mt-6 space-y-2 text-sm text-gray-700">
        {loading ? (
          <p>Carregando...</p>
        ) : categories.length ? (
          categories.map((category) => {
            const isSelected = selectedCategoryId === category.id;
            const balance = balanceByCategory.get(category.id) ?? 0;
            return (
              <div key={category.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCategoryId((current) =>
                        current === category.id ? null : category.id,
                      )
                    }
                    className="flex flex-1 items-center justify-between rounded-md border border-gray-100 px-3 py-2 text-left text-sm text-gray-800 transition hover:bg-gray-50"
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-500">
                      {isSelected ? "Ocultar saldo" : "Ver saldo"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Tem certeza que deseja excluir esta categoria? Todas as movimentações dela serão removidas.",
                      );
                      if (confirmed) {
                        onDeleteCategory(category.id);
                      }
                    }}
                    className="rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </div>
                {isSelected ? (
                  <div className="mt-2 rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    <div className="flex items-center justify-between">
                      <span>Saldo da categoria</span>
                      <span className="font-semibold text-gray-900">
                        {balance.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <p>Nenhuma categoria cadastrada.</p>
        )}
      </div>
    </section>
  );
}
