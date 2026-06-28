import { useQuery } from "@tanstack/react-query";
import { getRecords } from "../api/records";
import { CreateRecordForm } from "../components/records/CreateRecordForm";
import { StatusBadge } from "../components/StatusBadge";

export function RecordsPage() {
  const {
    data: records,
    isLoading,
    error,
  } = useQuery({ queryKey: ["records"], queryFn: getRecords });

  if (isLoading) return <p className="text-grey">Carregando...</p>;
  if (error)
    return <p className="text-status-out">Erro: {(error as Error).message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">
        Registros de Fermentação
      </h1>
      <CreateRecordForm />
      <table className="w-full bg-white rounded shadow-sm">
        <thead className="bg-navy text-white text-left">
          <tr>
            <th className="p-3">Data</th>
            <th className="p-3">Lote</th>
            <th className="p-3">Cerveja</th>
            <th className="p-3">Tanque</th>
            <th className="p-3">Temp.</th>
            <th className="p-3">pH</th>
            <th className="p-3">Extrato</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {records?.map((r) => (
            <tr key={r.id} className="border-b border-mist">
              <td className="p-3">
                {new Date(r.recordedAt).toLocaleString("pt-BR")}
              </td>
              <td className="p-3">{r.batchNumber}</td>
              <td className="p-3">{r.beerName}</td>
              <td className="p-3">{r.tankName}</td>
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
    </div>
  );
}
