import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteTank } from "../../api/tanks";
import { getRecords } from "../../api/records";
import { Modal } from "../Modal";
import type { Tank } from "../../api/types";

export function DeleteTankModal({
  tank,
  onClose,
}: {
  tank: Tank;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { data: records } = useQuery({
    queryKey: ["records"],
    queryFn: getRecords,
  });
  const affected = records?.filter((r) => r.tankId === tank.id).length ?? 0;
  const blocked = affected > 0;

  const mutation = useMutation({
    mutationFn: () => deleteTank(tank.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tanks"] });
      onClose();
    },
  });

  return (
    <Modal title="Excluir tanque" onClose={onClose}>
      {blocked ? (
        <div className="bg-status-out/20 border border-status-out rounded p-3 text-sm text-ink mb-4">
          <strong>{tank.name}</strong> possui{" "}
          <strong>{affected} registro(s)</strong> de fermentação e não pode ser
          excluído. O histórico é preservado por integridade dos dados.
        </div>
      ) : (
        <p className="text-ink mb-4">
          Tem certeza que deseja excluir <strong>{tank.name}</strong>? Esta ação
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
          className="px-4 py-2 rounded border border-steel text-ink"
        >
          {blocked ? "Fechar" : "Cancelar"}
        </button>
        {!blocked && (
          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="px-4 py-2 rounded bg-status-out text-ink font-semibold disabled:opacity-50"
          >
            {mutation.isPending ? "Excluindo..." : "Excluir"}
          </button>
        )}
      </div>
    </Modal>
  );
}
