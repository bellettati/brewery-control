import type { FermentationStatus } from "../api/types";

const styles: Record<FermentationStatus, { bg: string; label: string }> = {
  WithinStandard: { bg: "bg-status-ok", label: "Dentro do Padrão" },
  Attention: { bg: "bg-status-attention", label: "Atenção" },
  OutOfStandard: { bg: "bg-status-out", label: "Fora do Padrão" },
};

export function StatusBadge({ status }: { status: FermentationStatus }) {
  const s = styles[status];
  return (
    <span className={`${s.bg} text-ink text-sm px-2 py-1 rounded font-medium`}>
      {s.label}
    </span>
  );
}
