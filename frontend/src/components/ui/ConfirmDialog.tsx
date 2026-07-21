import { useEffect, useId, useRef } from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

type Variant = "danger" | "warning" | "success";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const styles = {
  danger: {
    iconBg: "bg-red-50",
    iconText: "text-red-700",
    button: "bg-[#E84545] text-white hover:brightness-95",
    icon: AlertTriangle,
  },
  warning: {
    iconBg: "bg-amber-50",
    iconText: "text-amber-700",
    button: "bg-[#E84545] text-white hover:brightness-95",
    icon: AlertTriangle,
  },
  success: {
    iconBg: "bg-[#3E8E91]/10",
    iconText: "text-[#3E8E91]",
    button: "bg-[#3E8E91] text-white hover:brightness-95",
    icon: CheckCircle,
  },
};

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "warning",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  const config = styles[variant];
  const Icon = config.icon;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/45 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isLoading) onCancel();
      }}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${config.iconBg} ${config.iconText}`}>
            <Icon size={26} />
          </span>
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-full p-2 text-[#333333]/50 transition hover:bg-[#F7F3EA] hover:text-[#333333] disabled:opacity-50"
            aria-label="Fechar diálogo"
          >
            <X size={20} />
          </button>
        </div>
        <h2 id={titleId} className="mt-5 text-2xl font-bold text-[#333333]">{title}</h2>
        <p id={descriptionId} className="mt-3 leading-7 text-[#333333]/70">{description}</p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-full border border-[#333333]/15 px-5 py-3 font-semibold text-[#333333]/70 transition hover:bg-[#F7F3EA] disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-full px-5 py-3 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${config.button}`}
          >
            {isLoading ? "Processando..." : confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
