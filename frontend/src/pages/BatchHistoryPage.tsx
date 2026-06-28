import { useQuery } from "@tanstack/react-query";
import { getRecords, getRecordsByBatch } from "../api/records";
import { StatusBadge } from "../components/StatusBadge";
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
    enabled: batch !== "", // don't fetch until a batch is selected
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">Histórico de Lotes</h1>

      <select
        className="border border-steel rounded px-3 py-2 mb-6 bg-white"
        value={batch}
        onChange={(e) => setBatch(e.target.value)}
      >
        <option value="" disabled>
          Selecione um lote
        </option>
        {batchNumbers.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      {batch === "" && (
        <p className="text-grey">Selecione um lote para ver sua evolução.</p>
      )}
      {isLoading && <p className="text-grey">Carregando...</p>}

      {history && history.length > 0 && (
        <table className="w-full bg-white rounded shadow-sm">
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
