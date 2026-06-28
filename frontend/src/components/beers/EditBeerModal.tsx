import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBeer } from "../../api/beers";
import { Modal } from "../Modal";
import { useState } from "react";
import type { Beer, UpdateBeerRequest } from "../../api/types";
import { validateBeer } from "./validateBeer";
import { Field } from "../Field";
import { TextInput } from "../inputs/TextInput";
import { NumberInput } from "../inputs/NumberInput";

export function EditBeerModal({
  beer,
  onClose,
}: {
  beer: Beer;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [attempted, setAttempted] = useState(false);
  const [form, setForm] = useState<UpdateBeerRequest>({
    name: beer.name,
    style: beer.style,
    tempMin: beer.tempMin,
    tempMax: beer.tempMax,
    phMin: beer.phMin,
    phMax: beer.phMax,
    extractMin: beer.extractMin,
    extractMax: beer.extractMax,
  });

  const errors = validateBeer({
    name: form.name ?? "",
    style: form.style ?? "",
    tempMin: form.tempMin!,
    tempMax: form.tempMax!,
    phMin: form.phMin!,
    phMax: form.phMax!,
    extractMin: form.extractMin!,
    extractMax: form.extractMax!,
  });

  const mutation = useMutation({
    mutationFn: () => updateBeer(beer.id, form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["beers"] });
      onClose();
    },
  });

  function update<K extends keyof UpdateBeerRequest>(
    key: K,
    value: UpdateBeerRequest[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit() {
    setAttempted(true);
    if (errors.length === 0) mutation.mutate();
  }

  return (
    <Modal title={`Editar ${beer.name}`} onClose={onClose}>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field label="Nome" required>
          <TextInput
            value={form.name ?? ""}
            onChange={(v) => update("name", v)}
          />
        </Field>
        <Field label="Estilo" required>
          <TextInput
            value={form.style ?? ""}
            onChange={(v) => update("style", v)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <Field label="Temp. mín (°C)" required>
          <NumberInput
            value={form.tempMin!}
            onChange={(v) => update("tempMin", v)}
          />
        </Field>
        <Field label="pH mín" required>
          <NumberInput
            value={form.phMin!}
            onChange={(v) => update("phMin", v)}
          />
        </Field>
        <Field label="Extrato mín (°P)" required>
          <NumberInput
            value={form.extractMin!}
            onChange={(v) => update("extractMin", v)}
          />
        </Field>
        <Field label="Temp. máx (°C)" required>
          <NumberInput
            value={form.tempMax!}
            onChange={(v) => update("tempMax", v)}
          />
        </Field>
        <Field label="pH máx" required>
          <NumberInput
            value={form.phMax!}
            onChange={(v) => update("phMax", v)}
          />
        </Field>
        <Field label="Extrato máx (°P)" required>
          <NumberInput
            value={form.extractMax!}
            onChange={(v) => update("extractMax", v)}
          />
        </Field>
      </div>

      <div className="bg-status-attention/20 border border-status-attention rounded p-3 text-sm text-ink mb-4">
        Alterar os parâmetros não reclassifica registros já existentes — apenas
        novos registros usarão as faixas atualizadas.
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
