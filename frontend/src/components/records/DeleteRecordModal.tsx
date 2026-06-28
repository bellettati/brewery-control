import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRecord } from "../../api/records";
import { Modal } from "../Modal";
import { Button } from "../inputs/Button";
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
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Excluindo..." : "Excluir"}
        </Button>
      </div>
    </Modal>
  );
}
