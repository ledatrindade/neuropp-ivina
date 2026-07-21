type FeedbackMessageProps = {
  type: "error" | "success" | "info";
  children: React.ReactNode;
};

export function FeedbackMessage({ type, children }: FeedbackMessageProps) {
  const className = {
    error: "bg-red-50 text-red-700 border-red-100",
    success: "bg-green-50 text-green-700 border-green-100",
    info: "bg-blue-50 text-blue-700 border-blue-100",
  }[type];

  return (
    <div role={type === "error" ? "alert" : "status"} className={`rounded-2xl border p-4 text-sm font-medium ${className}`}>
      {children}
    </div>
  );
}
