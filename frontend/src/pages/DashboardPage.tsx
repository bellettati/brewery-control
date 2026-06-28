import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../api/dashboard";

export function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  if (isLoading) return <p className="text-grey">Carregando...</p>;
  if (error)
    return <p className="text-status-out">Erro: {(error as Error).message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-ink mb-6">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <Card
          label="Total de Registros"
          value={data!.total}
          bg="bg-navy"
          text="text-white"
        />
        <Card
          label="Dentro do Padrão"
          value={data!.withinStandard}
          bg="bg-status-ok"
          text="text-ink"
        />
        <Card
          label="Atenção"
          value={data!.attention}
          bg="bg-status-attention"
          text="text-ink"
        />
        <Card
          label="Fora do Padrão"
          value={data!.outOfStandard}
          bg="bg-status-out"
          text="text-ink"
        />
      </div>
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
    <div className={`${bg} ${text} rounded-lg shadow-sm p-6 flex flex-col`}>
      <span className="text-4xl font-bold">{value}</span>
      <span className="text-sm mt-2 opacity-90">{label}</span>
    </div>
  );
}
