import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";

type BackButtonProps = {
  to: string;
  label?: string;
  className?: string;
};

export function BackButton({
  to,
  label = "Voltar",
  className = "mb-6",
}: BackButtonProps) {
  return (
    <Link
      to={to}
      className={`${className} inline-flex w-fit items-center gap-2 rounded-full border border-[#3E8E91]/20 px-4 py-2 text-sm font-semibold text-[#3E8E91] transition hover:bg-[#3E8E91] hover:text-white`}
    >
      <ArrowLeft size={18} />
      {label}
    </Link>
  );
}