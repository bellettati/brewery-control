import type { FermentationRecord } from "../../api/types";

export function StatusPercentages({
  records,
}: {
  records: FermentationRecord[];
}) {
  const total = records.length;
  const pct = (status: FermentationRecord["status"]) =>
    total === 0
      ? 0
      : Math.round(
          (records.filter((r) => r.status === status).length / total) * 100,
        );

  const within = pct("WithinStandard");
  const attention = pct("Attention");
  const out = pct("OutOfStandard");

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-ink mb-3">Distribuição geral</h3>

      {total === 0 ? (
        <p className="text-grey text-sm">Nenhum registro.</p>
      ) : (
        <>
          <div className="flex h-4 rounded overflow-hidden mb-3">
            <div className="bg-status-ok" style={{ width: `${within}%` }} />
            <div
              className="bg-status-attention"
              style={{ width: `${attention}%` }}
            />
            <div className="bg-status-out" style={{ width: `${out}%` }} />
          </div>

          <div className="flex gap-4 text-sm">
            <Legend color="bg-status-ok" label="Dentro" value={within} />
            <Legend
              color="bg-status-attention"
              label="Atenção"
              value={attention}
            />
            <Legend color="bg-status-out" label="Fora" value={out} />
          </div>
        </>
      )}
    </div>
  );
}

function Legend({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <span className="flex items-center gap-1">
      <span className={`${color} w-3 h-3 rounded-sm inline-block`} />
      {label}: {value}%
    </span>
  );
}
