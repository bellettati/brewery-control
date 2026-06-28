import { useQuery } from "@tanstack/react-query";
import { getBeers } from "../api/beers";
import { CreateBeerForm } from "../components/beers/CreateBeerForm";
import { DeleteBeerModal } from "../components/beers/DeleteBeerModal";
import { EditBeerModal } from "../components/beers/EditBeerModal";
import { RowActions } from "../components/RowActions";
import { useState } from "react";
import type { Beer } from "../api/types";

export function BeersPage() {
  const {
    data: beers,
    isLoading,
    error,
  } = useQuery({ queryKey: ["beers"], queryFn: getBeers });
  const [editing, setEditing] = useState<Beer | null>(null);
  const [deleting, setDeleting] = useState<Beer | null>(null);

  if (isLoading) return <p className="text-grey">Carregando...</p>;
  if (error)
    return <p className="text-status-out">Erro: {(error as Error).message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">Cervejas</h1>
      <CreateBeerForm />
      <table className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
        <thead className="bg-navy text-white text-left">
          <tr>
            <th className="p-3">Nome</th>
            <th className="p-3">Estilo</th>
            <th className="p-3">Temp.</th>
            <th className="p-3">pH</th>
            <th className="p-3">Extrato</th>
            <th className="p-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          {beers?.length === 0 && (
            <tr>
              <td colSpan={6} className="p-4 text-grey text-center">
                Nenhuma cerveja cadastrada.
              </td>
            </tr>
          )}
          {beers?.map((b) => (
            <tr key={b.id} className="border-b border-mist">
              <td className="p-3">{b.name}</td>
              <td className="p-3">{b.style}</td>
              <td className="p-3">
                {b.tempMin}–{b.tempMax}°C
              </td>
              <td className="p-3">
                {b.phMin}–{b.phMax}
              </td>
              <td className="p-3">
                {b.extractMin}–{b.extractMax}°P
              </td>
              <td className="p-3">
                <RowActions
                  onEdit={() => setEditing(b)}
                  onDelete={() => setDeleting(b)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editing && (
        <EditBeerModal beer={editing} onClose={() => setEditing(null)} />
      )}
      {deleting && (
        <DeleteBeerModal beer={deleting} onClose={() => setDeleting(null)} />
      )}
    </div>
  );
}
