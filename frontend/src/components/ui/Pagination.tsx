import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  totalElements?: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, totalPages, totalElements, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-6 flex flex-col items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm sm:flex-row" aria-label="Paginação">
      <p className="text-sm text-[#333333]/65">
        Página <strong>{page + 1}</strong> de <strong>{totalPages}</strong>
        {typeof totalElements === "number" ? ` • ${totalElements} registros` : ""}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 0}
          className="inline-flex items-center gap-2 rounded-full border border-[#3E8E91]/20 px-4 py-2 text-sm font-semibold text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={17} /> Anterior
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="inline-flex items-center gap-2 rounded-full border border-[#3E8E91]/20 px-4 py-2 text-sm font-semibold text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Próxima <ChevronRight size={17} />
        </button>
      </div>
    </nav>
  );
}
