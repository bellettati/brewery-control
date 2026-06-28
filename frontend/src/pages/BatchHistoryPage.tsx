import { useQuery } from "@tanstack/react-query";
import { getRecords, getRecordsByBatch } from "../api/records";
import { StatusBadge } from "../components/StatusBadge";
import { Field } from "../components/Field";
import { Select } from "../components/inputs/Select";
import { useState } from "react";

export function BatchHistoryPage() {
  const [batch, setBatch] = useState<string>("");

  const { data: allRecords } = useQuery({
    queryKey: ["records"],
    queryFn: getRecords,
  });
  const batchNumbers = [
    ...new Set(allRecords?.map((r) => r.batchNumber) ?? []),
  ];

  const { data: history, isLoading } = useQuery({
    queryKey: ["records", "batch", batch],
    queryFn: () => getRecordsByBatch(batch),
    enabled: batch !== "",
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">Histórico de Lotes</h1>

      <div className="max-w-xs mb-6">
        <Field label="Lote">
          <Select value={batch} onChange={setBatch}>
            <option value="" disabled>
              Selecione um lote
            </option>
            {batchNumbers.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {batch === "" && (
        <p className="text-grey">Selecione um lote para ver sua evolução.</p>
      )}
      {isLoading && <p className="text-grey">Carregando...</p>}
      {batch !== "" && !isLoading && history?.length === 0 && (
        <p className="text-grey">Nenhum registro para este lote.</p>
      )}

      {history && history.length > 0 && (
        <table className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
          <thead className="bg-navy text-white text-left">
            <tr>
              <th className="p-3">Data</th>
              <th className="p-3">Temp.</th>
              <th className="p-3">pH</th>
              <th className="p-3">Extrato</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((r) => (
              <tr key={r.id} className="border-b border-mist">
                <td className="p-3">
                  {new Date(r.recordedAt).toLocaleString("pt-BR")}
                </td>
                <td className="p-3">{r.temperature}°C</td>
                <td className="p-3">{r.ph}</td>
                <td className="p-3">{r.extract}°P</td>
                <td className="p-3">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
