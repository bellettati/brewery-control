import { useQuery } from "@tanstack/react-query";
import { getBeers } from "../api/beers";
import { CreateBeerForm } from "../components/beers/CreateBeerForm";

export function BeersPage() {
  const {
    data: beers,
    isLoading,
    error,
  } = useQuery({ queryKey: ["beers"], queryFn: getBeers });

  if (isLoading) return <p className="text-grey">Carregando...</p>;
  if (error)
    return <p className="text-status-out">Erro: {(error as Error).message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">Cervejas</h1>
      <CreateBeerForm />
      <table className="w-full bg-white rounded shadow-sm">
        <thead className="bg-navy text-white text-left">
          <tr>
            <th className="p-3">Nome</th>
            <th className="p-3">Estilo</th>
            <th className="p-3">Temp.</th>
            <th className="p-3">pH</th>
            <th className="p-3">Extrato</th>
          </tr>
        </thead>
        <tbody>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
