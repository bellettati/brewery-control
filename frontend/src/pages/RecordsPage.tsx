import { useQuery } from "@tanstack/react-query";
import { getRecords } from "../api/records";
import { CreateRecordForm } from "../components/records/CreateRecordForm";
import { EditRecordModal } from "../components/records/EditRecordModal";
import { DeleteRecordModal } from "../components/records/DeleteRecordModal";
import { StatusBadge } from "../components/StatusBadge";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import type { FermentationRecord } from "../api/types";

export function RecordsPage() {
  const {
    data: records,
    isLoading,
    error,
  } = useQuery({ queryKey: ["records"], queryFn: getRecords });
  const [editing, setEditing] = useState<FermentationRecord | null>(null);
  const [deleting, setDeleting] = useState<FermentationRecord | null>(null);

  if (isLoading) return <p className="text-grey">Carregando...</p>;
  if (error)
    return <p className="text-status-out">Erro: {(error as Error).message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">
        Registros de Fermentação
      </h1>
      <CreateRecordForm />

      <table className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
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
            <th className="p-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {records?.length === 0 && (
            <tr>
              <td colSpan={9} className="p-4 text-grey text-center">
                Nenhum registro.
              </td>
            </tr>
          )}
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
              <td className="p-3">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditing(r)}
                    className="text-navy hover:text-brand"
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => setDeleting(r)}
                    className="text-grey hover:text-status-out"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <EditRecordModal record={editing} onClose={() => setEditing(null)} />
      )}
      {deleting && (
        <DeleteRecordModal
          record={deleting}
          onClose={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
