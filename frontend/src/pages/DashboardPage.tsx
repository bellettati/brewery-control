import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../api/dashboard";
import { getRecords } from "../api/records";
import { getBeers } from "../api/beers";
import { StatusBreakdown } from "../components/dashboard/StatusBreakdown";
import { StatusPercentages } from "../components/dashboard/StatusPercentage";
import { PerBeerBreakdown } from "../components/dashboard/PerBeerBreakdown";

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });
  const { data: records } = useQuery({
    queryKey: ["records"],
    queryFn: getRecords,
  });
  const { data: beers } = useQuery({ queryKey: ["beers"], queryFn: getBeers });

  if (isLoading) return <p className="text-grey">Carregando...</p>;
  if (error)
    return <p className="text-status-out">Erro: {(error as Error).message}</p>;

  const beersById = new Map((beers ?? []).map((b) => [b.id, b]));

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card
          label="Total de Registros"
          value={data!.total}
          bg="bg-white"
          text="text-navy"
        />
        <Card
          label="Dentro do Padrão"
          value={data!.withinStandard}
          bg="bg-white"
          text="text-status-ok"
        />
        <Card
          label="Atenção"
          value={data!.attention}
          bg="bg-white"
          text="text-status-attention"
        />
        <Card
          label="Fora do Padrão"
          value={data!.outOfStandard}
          bg="bg-white"
          text="text-status-out"
        />
      </div>

      <h2 className="text-lg font-semibold text-ink mb-3">
        Detalhamento por status
      </h2>
      {records && beers && (
        <div className="space-y-4">
          <StatusPercentages records={records} />
          <PerBeerBreakdown records={records} beers={beers} />
          <StatusBreakdown records={records} beersById={beersById} />
        </div>
      )}
    </div>
  );
}

function Card({
  label,
  value,
  bg,
  text,
}: {
  label: string;
  value: number;
  bg: string;
  text: string;
}) {
  return (
    <div className={`${bg} ${text} rounded-lg p-6 flex flex-col`}>
      <span className="text-4xl font-bold">{value}</span>
      <span className="text-sm mt-2 opacity-90 font-semibold text-ink">
        {label}
      </span>
    </div>
  );
}
