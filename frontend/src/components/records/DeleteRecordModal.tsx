import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecord } from "../../api/records";
import { Modal } from "../Modal";
import type { FermentationRecord } from "../../api/types";

export function DeleteRecordModal({
  record,
  onClose,
}: {
  record: FermentationRecord;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteRecord(record.id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["records"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onClose();
    },
  });

  return (
    <Modal title="Excluir registro" onClose={onClose}>
      <p className="text-ink mb-4">
        Excluir o registro do lote <strong>{record.batchNumber}</strong> de{" "}
        {new Date(record.recordedAt).toLocaleString("pt-BR")}? Esta ação não
        pode ser desfeita.
      </p>

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
          Cancelar
        </button>
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="px-4 py-2 rounded bg-status-out text-ink font-semibold disabled:opacity-50"
        >
          {mutation.isPending ? "Excluindo..." : "Excluir"}
        </button>
      </div>
    </Modal>
  );
}
