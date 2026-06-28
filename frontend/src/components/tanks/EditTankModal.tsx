import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTank } from "../../api/tanks";
import { Modal } from "../Modal";
import { useState } from "react";
import type { Tank, UpdateTankRequest } from "../../api/types";
import { validateTank } from "./validateTank";

export function EditTankModal({
  tank,
  onClose,
}: {
  tank: Tank;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [attempted, setAttempted] = useState(false);
  const [form, setForm] = useState<UpdateTankRequest>({
    name: tank.name,
    capacityLiters: tank.capacityLiters,
  });

  const errors = validateTank({
    name: form.name ?? "",
    capacityLiters: form.capacityLiters!,
  });

  const mutation = useMutation({
    mutationFn: () => updateTank(tank.id, form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tanks"] });
      onClose();
    },
  });

  function update<K extends keyof UpdateTankRequest>(
    key: K,
    value: UpdateTankRequest[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit() {
    setAttempted(true);
    if (errors.length === 0) mutation.mutate();
  }

  return (
    <Modal title={`Editar ${tank.name}`} onClose={onClose}>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <label className="flex flex-col text-sm text-grey">
          Nome
          <input
            className="border border-steel rounded px-3 py-2 text-ink"
            value={form.name ?? ""}
            onChange={(e) => update("name", e.target.value)}
          />
        </label>
        <label className="flex flex-col text-sm text-grey">
          Capacidade (L)
          <input
            type="number"
            step="0.1"
            className="border border-steel rounded px-3 py-2 text-ink"
            value={form.capacityLiters!}
            onChange={(e) => update("capacityLiters", Number(e.target.value))}
          />
        </label>
      </div>

      {attempted && errors.length > 0 && (
        <ul className="text-status-out text-sm mb-3 list-disc pl-5">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
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
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="px-4 py-2 rounded bg-brand text-ink font-semibold disabled:opacity-50"
        >
          {mutation.isPending ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </Modal>
  );
}
