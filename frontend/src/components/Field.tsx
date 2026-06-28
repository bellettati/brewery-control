import type { ReactNode } from "react";

export function Field({
  label,
  required = false,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-grey">
      <span>
        {label}
        {required && <span className="text-status-out"> *</span>}
      </span>
      {children}
      {hint && <span className="text-xs text-grey mt-1">{hint}</span>}
    </label>
  );
}
