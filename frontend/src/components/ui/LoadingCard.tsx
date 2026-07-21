import { Loader2 } from "lucide-react";

export function LoadingCard({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-sm" aria-live="polite">
      <Loader2 className="mx-auto animate-spin text-[#3E8E91]" size={34} />
      <p className="mt-4 text-[#333333]/70">{label}</p>
    </div>
  );
}
