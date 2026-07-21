import { Home, SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-5 py-16">
      <section className="w-full rounded-[2rem] bg-white p-8 text-center shadow-sm md:p-12">
        <SearchX className="mx-auto text-[#3E8E91]" size={48} />
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#E84545]">Erro 404</p>
        <h1 className="mt-3 text-3xl font-bold text-[#333333]">Página não encontrada</h1>
        <p className="mt-4 text-[#333333]/65">O endereço informado não existe ou foi alterado.</p>
        <Link to="/" className="primary-button mt-6"><Home size={18} />Voltar ao início</Link>
      </section>
    </main>
  );
}
