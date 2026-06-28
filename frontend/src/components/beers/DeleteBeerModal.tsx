import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBeer } from "../../api/beers";
import { getRecords } from "../../api/records";
import { Modal } from "../Modal";
import type { Beer } from "../../api/types";

export function DeleteBeerModal({
  beer,
  onClose,
}: {
  beer: Beer;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { data: records } = useQuery({
    queryKey: ["records"],
    queryFn: getRecords,
  });
  const affected = records?.filter((r) => r.beerId === beer.id).length ?? 0;
  const blocked = affected > 0;

  const mutation = useMutation({
    mutationFn: () => deleteBeer(beer.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["beers"] });
      onClose();
    },
  });

  return (
    <Modal title="Excluir cerveja" onClose={onClose}>
      {blocked ? (
        <div className="bg-status-out/20 border border-status-out rounded p-3 text-sm text-ink mb-4">
          <strong>{beer.name}</strong> possui{" "}
          <strong>{affected} registro(s)</strong> de fermentação e não pode ser
          excluída. O histórico de fermentação é preservado por integridade dos
          dados. Para remover esta cerveja, seria necessário tratar os registros
          associados primeiro.
        </div>
      ) : (
        <p className="text-ink mb-4">
          Tem certeza que deseja excluir <strong>{beer.name}</strong>? Esta ação
          não pode ser desfeita.
        </p>
      )}

      {mutation.isError && (
        <p className="text-status-out text-sm mb-3">
          {(mutation.error as Error).message}
        </p>
      )}

      <div className="flex gap-3 justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded border border-steel text-ink cursor-pointer"
        >
          {blocked ? "Fechar" : "Cancelar"}
        </button>
        {!blocked && (
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="px-4 py-2 rounded bg-status-out text-ink font-semibold disabled:opacity-50 cursor-pointer"
          >
            {mutation.isPending ? "Excluindo..." : "Excluir"}
          </button>
        )}
      </div>
    </Modal>
  );
}
