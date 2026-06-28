import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type {
  Beer,
  FermentationRecord,
  FermentationStatus,
} from "../../api/types";

const sections: { status: FermentationStatus; label: string; text: string }[] =
  [
    {
      status: "WithinStandard",
      label: "Dentro do Padrão",
      text: "text-status-ok",
    },
    { status: "Attention", label: "Atenção", text: "text-status-attention" },
    {
      status: "OutOfStandard",
      label: "Fora do Padrão",
      text: "text-status-out",
    },
  ];

export function StatusBreakdown({
  records,
  beersById,
}: {
  records: FermentationRecord[];
  beersById: Map<number, Beer>;
}) {
  return (
    <div className="flex flex-col gap-3">
      {sections.map((s) => (
        <StatusSection
          key={s.status}
          label={s.label}
          text={s.text}
          records={records.filter((r) => r.status === s.status)}
          beersById={beersById}
          showExpected={s.status !== "WithinStandard"}
        />
      ))}
    </div>
  );
}

function StatusSection({
  label,
  text,
  records,
  beersById,
  showExpected,
}: {
  label: string;
  text: string;
  records: FermentationRecord[];
  beersById: Map<number, Beer>;
  showExpected: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <button
        className={`${text} text-ink w-full flex items-center justify-between px-4 py-3 font-semibold cursor-pointer`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="flex items-center gap-3">
          <span className="flex justify-center items-center bg-navy text-white text-sm h-6 w-6 rounded">
            {records.length}
          </span>
          {label}
        </span>
        {open ? (
          <ChevronDown className="text-ink" size={18} />
        ) : (
          <ChevronRight className="text-ink" size={18} />
        )}
      </button>

      {open && (
        <div className="divide-y divide-mist">
          {records.length === 0 && (
            <p className="px-4 py-3 text-grey text-sm">Nenhum registro.</p>
          )}
          {records.map((r) => (
            <RecordRow
              key={r.id}
              record={r}
              beer={beersById.get(r.beerId)}
              showExpected={showExpected}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RecordRow({
  record,
  beer,
  showExpected,
}: {
  record: FermentationRecord;
  beer: Beer | undefined;
  showExpected: boolean;
}) {
  return (
    <div className="px-4 py-3 text-sm">
      <div className="font-medium text-ink">
        {record.beerName} · lote {record.batchNumber}
      </div>
      <div className="text-grey mt-1">
        Leituras: {record.temperature}°C · pH {record.ph} · {record.extract}°P
      </div>

      {showExpected && beer && (
        <div className="text-grey mt-1">
          {outOfRange(
            "Temp",
            record.temperature,
            beer.tempMin,
            beer.tempMax,
            "°C",
          )}
          {outOfRange("pH", record.ph, beer.phMin, beer.phMax, "")}
          {outOfRange(
            "Extrato",
            record.extract,
            beer.extractMin,
            beer.extractMax,
            "°P",
          )}
        </div>
      )}
    </div>
  );
}

function outOfRange(
  label: string,
  value: number,
  min: number,
  max: number,
  unit: string,
) {
  if (value >= min && value <= max) return null;
  return (
    <div key={label} className="text-status-out">
      {label} fora: {value}
      {unit} (esperado {min}–{max}
      {unit})
    </div>
  );
}
