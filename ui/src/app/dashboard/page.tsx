"use client";

import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import BalanceSummary from "@/components/dashboard/BalanceSummary";
import CategorySection from "@/components/dashboard/CategorySection";
import TransactionsSection from "@/components/dashboard/TransactionsSection";
import useDashboardData from "@/hooks/useDashboardData";

 export default function DashboardPage() {
  const {
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
  } = useDashboardData();

   return (
     <main className="min-h-screen bg-gray-50 px-6 py-10">
       <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
         <SignedOut>
           <div className="rounded-lg border border-gray-200 bg-white p-6">
             <h1 className="text-2xl font-semibold text-gray-900">
               Faça login para acessar o painel
             </h1>
             <p className="mt-2 text-gray-600">
               Entre com sua conta para ver categorias e movimentações.
             </p>
             <Link
               href="/sign-in"
              className="mt-4 inline-flex rounded-md bg-brand px-5 py-2 text-sm font-semibold text-white"
             >
               Ir para login
             </Link>
           </div>
         </SignedOut>

        <SignedIn>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-600">
                Gerencie suas categorias e movimentações financeiras.
              </p>
            </div>
            <SignOutButton>
              <button
                type="button"
                className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-100 hover:text-gray-900"
              >
                Sair
              </button>
            </SignOutButton>
          </div>

          <BalanceSummary totalBalance={totalBalance} />

          {successMessage ? (
            <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {successMessage}
            </div>
          ) : null}

           {error ? (
             <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
               {error}
             </div>
           ) : null}

          <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
            <CategorySection
              loading={loading}
              categories={categories}
              onCreateCategory={handleCreateCategory}
              onDeleteCategory={handleDeleteCategory}
              balanceByCategory={balanceByCategory}
            />
            <TransactionsSection
              loading={loading}
              categories={categories}
              transactions={transactionsWithSign}
              categoryById={categoryById}
              onCreateTransaction={handleCreateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
         </SignedIn>
       </div>
     </main>
   );
 }
