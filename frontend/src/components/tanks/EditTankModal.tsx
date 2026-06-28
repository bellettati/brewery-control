import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTank } from "../../api/tanks";
import { Modal } from "../Modal";
import { useState } from "react";
import type { Tank, UpdateTankRequest } from "../../api/types";
import { validateTank } from "./validateTank";
import { Field } from "../Field";
import { TextInput } from "../inputs/TextInput";
import { NumberInput } from "../inputs/NumberInput";
import { Button } from "../inputs/Button";

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
        <Field label="Nome" required>
          <TextInput
            value={form.name ?? ""}
            onChange={(v) => update("name", v)}
          />
        </Field>
        <Field label="Capacidade (L)" required>
          <NumberInput
            value={form.capacityLiters!}
            onChange={(v) => update("capacityLiters", v)}
          />
        </Field>
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
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </Modal>
  );
}
