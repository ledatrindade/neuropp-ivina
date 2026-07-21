import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
};

export function EmptyState({ icon: Icon, title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
      <Icon className="mx-auto text-[#3E8E91]" size={42} />
      <h2 className="mt-4 text-2xl font-bold text-[#333333]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-[#333333]/70">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="mt-6 inline-flex rounded-full bg-[#E84545] px-6 py-3 font-semibold text-white transition hover:brightness-95">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
