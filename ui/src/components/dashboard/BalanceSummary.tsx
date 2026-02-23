import type { BalanceSummaryProps } from "@/types/dashboard";

export default function BalanceSummary({ totalBalance }: BalanceSummaryProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-sm font-semibold text-gray-500">Saldo total</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">
        {totalBalance.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
    </div>
  );
}
