import { useQuery } from "@tanstack/react-query";
import { getTanks } from "../api/tanks";
import { CreateTankForm } from "../components/tanks/CreateTankForm";

export function TanksPage() {
  const {
    data: tanks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tanks"],
    queryFn: getTanks,
  });

  if (isLoading) return <p className="text-grey">Carregando...</p>;
  if (error)
    return <p className="text-status-out">Erro: {(error as Error).message}</p>;

  return (
    <div>
      <CreateTankForm />
      <h1 className="text-2xl font-bold text-ink mb-6">Tanques</h1>
      <table className="w-full bg-white rounded shadow-sm">
        <thead className="bg-navy text-white text-left">
          <tr>
            <th className="p-3">Nome</th>
            <th className="p-3">Capacidade (L)</th>
          </tr>
        </thead>
        <tbody>
          {tanks?.map((t) => (
            <tr key={t.id} className="border-b border-mist">
              <td className="p-3">{t.name}</td>
              <td className="p-3">{t.capacityLiters}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
