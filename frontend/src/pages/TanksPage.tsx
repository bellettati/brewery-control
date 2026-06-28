import { useQuery } from "@tanstack/react-query";
import { getTanks } from "../api/tanks";
import { CreateTankForm } from "../components/tanks/CreateTankForm";
import { EditTankModal } from "../components/tanks/EditTankModal";
import { DeleteTankModal } from "../components/tanks/DeleteTankModal";
import { RowActions } from "../components/RowActions";
import { useState } from "react";
import type { Tank } from "../api/types";

export function TanksPage() {
  const {
    data: tanks,
    isLoading,
    error,
  } = useQuery({ queryKey: ["tanks"], queryFn: getTanks });
  const [editing, setEditing] = useState<Tank | null>(null);
  const [deleting, setDeleting] = useState<Tank | null>(null);

  if (isLoading) return <p className="text-grey">Carregando...</p>;
  if (error)
    return <p className="text-status-out">Erro: {(error as Error).message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">Tanques</h1>
      <CreateTankForm />
      <table className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
        <thead className="bg-navy text-white text-left">
          <tr>
            <th className="p-3">Nome</th>
            <th className="p-3">Capacidade (L)</th>
            <th className="p-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {tanks?.length === 0 && (
            <tr>
              <td colSpan={3} className="p-4 text-grey text-center">
                Nenhum tanque cadastrado.
              </td>
            </tr>
          )}
          {tanks?.map((t) => (
            <tr key={t.id} className="border-b border-mist">
              <td className="p-3">{t.name}</td>
              <td className="p-3">{t.capacityLiters}</td>
              <td className="p-3">
                <RowActions
                  onEdit={() => setEditing(t)}
                  onDelete={() => setDeleting(t)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editing && (
        <EditTankModal tank={editing} onClose={() => setEditing(null)} />
      )}
      {deleting && (
        <DeleteTankModal tank={deleting} onClose={() => setDeleting(null)} />
      )}
    </div>
  );
}
