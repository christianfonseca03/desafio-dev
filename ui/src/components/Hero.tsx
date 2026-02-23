import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Hero() {
  return (
    <section
      id="inicio"
      className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center"
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">
        Controle financeiro em um só lugar
      </div>
      <h1 className="text-4xl font-semibold text-gray-900 sm:text-5xl">
        teste-dev
      </h1>
      <p className="max-w-2xl text-base text-gray-600 sm:text-lg">
        Faça seu login e comece a fazer movimentações bancárias de forma rápida,
        segura e organizada.
      </p>
      <SignedOut>
        <Link
          href="/sign-in"
          className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand/90"
        >
          Fazer login
        </Link>
      </SignedOut>
      <SignedIn>
        <Link
          href="/dashboard"
          className="rounded-md bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand/90"
        >
          Ir para o painel
        </Link>
      </SignedIn>
    </section>
  );
}
