"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  pendingLabel,
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`bg-ink text-paper px-4 py-2 rounded-sm hover:bg-ink/85 transition-colors disabled:opacity-50 font-medium text-sm ${className}`}
    >
      {pending ? pendingLabel ?? "…" : children}
    </button>
  );
}
