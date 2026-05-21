export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#3E8E91]/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-[#333333]/70 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} NeuroPP Ivina Peixoto. Todos os direitos reservados.
        </p>

        <p>
          Desenvolvido por <strong className="text-[#3E8E91]">LT Tech</strong>
        </p>
      </div>
    </footer>
  );
}