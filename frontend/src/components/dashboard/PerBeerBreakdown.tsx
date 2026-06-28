import type { Beer, FermentationRecord } from "../../api/types";

export function PerBeerBreakdown({
  records,
  beers,
}: {
  records: FermentationRecord[];
  beers: Beer[];
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h3 className="font-semibold text-ink mb-3">Distribuição por cerveja</h3>
      <div className="flex flex-col gap-4">
        {beers.map((beer) => {
          const beerRecords = records.filter((r) => r.beerId === beer.id);
          const total = beerRecords.length;
          const pct = (status: FermentationRecord["status"]) =>
            total === 0
              ? 0
              : Math.round(
                  (beerRecords.filter((r) => r.status === status).length /
                    total) *
                    100,
                );

          const within = pct("WithinStandard");
          const attention = pct("Attention");
          const out = pct("OutOfStandard");

          return (
            <div key={beer.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-ink">{beer.name}</span>
                <span className="text-grey">{total} registro(s)</span>
              </div>

              {total === 0 ? (
                <div className="h-3 rounded bg-mist" />
              ) : (
                <>
                  <div className="flex h-3 rounded overflow-hidden">
                    <div
                      className="bg-status-ok"
                      style={{ width: `${within}%` }}
                    />
                    <div
                      className="bg-status-attention"
                      style={{ width: `${attention}%` }}
                    />
                    <div
                      className="bg-status-out"
                      style={{ width: `${out}%` }}
                    />
                  </div>

                  {/* percentages as text */}
                  <div className="flex gap-3 text-xs text-grey mt-1">
                    <span className="flex items-center gap-1">
                      <span className="bg-status-ok w-2 h-2 rounded-sm inline-block" />
                      {within}% dentro
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="bg-status-attention w-2 h-2 rounded-sm inline-block" />
                      {attention}% atenção
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="bg-status-out w-2 h-2 rounded-sm inline-block" />
                      {out}% fora
                    </span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
