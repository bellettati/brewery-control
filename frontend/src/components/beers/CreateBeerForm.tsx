import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBeer } from "../../api/beers";
import { useState } from "react";
import type { CreateBeerRequest } from "../../api/types";
import { validateBeer } from "./validateBeer";
import { Field } from "../Field";
import { TextInput } from "../inputs/TextInput";
import { NumberInput } from "../inputs/NumberInput";
import { Button } from "../inputs/Button";

const empty: CreateBeerRequest = {
  name: "",
  style: "",
  tempMin: 0,
  tempMax: 0,
  phMin: 0,
  phMax: 0,
  extractMin: 0,
  extractMax: 0,
};

export function CreateBeerForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CreateBeerRequest>(empty);
  const [attempted, setAttempted] = useState(false);
  const errors = validateBeer(form);

  const mutation = useMutation({
    mutationFn: createBeer,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["beers"] });
      setForm(empty);
      setAttempted(false);
    },
  });

  function update<K extends keyof CreateBeerRequest>(
    key: K,
    value: CreateBeerRequest[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit() {
    setAttempted(true);
    if (errors.length === 0) mutation.mutate(form);
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field label="Nome" required>
          <TextInput value={form.name} onChange={(v) => update("name", v)} />
        </Field>
        <Field label="Estilo" required>
          <TextInput value={form.style} onChange={(v) => update("style", v)} />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <Field label="Temp. mín (°C)" required>
          <NumberInput
            value={form.tempMin}
            onChange={(v) => update("tempMin", v)}
          />
        </Field>
        <Field label="pH mín" required>
          <NumberInput
            value={form.phMin}
            onChange={(v) => update("phMin", v)}
          />
        </Field>
        <Field label="Extrato mín (°P)" required>
          <NumberInput
            value={form.extractMin}
            onChange={(v) => update("extractMin", v)}
          />
        </Field>
        <Field label="Temp. máx (°C)" required>
          <NumberInput
            value={form.tempMax}
            onChange={(v) => update("tempMax", v)}
          />
        </Field>
        <Field label="pH máx" required>
          <NumberInput
            value={form.phMax}
            onChange={(v) => update("phMax", v)}
          />
        </Field>
        <Field label="Extrato máx (°P)" required>
          <NumberInput
            value={form.extractMax}
            onChange={(v) => update("extractMax", v)}
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

      <Button onClick={handleSubmit} disabled={mutation.isPending}>
        {mutation.isPending ? "Salvando..." : "Adicionar Cerveja"}
      </Button>
    </div>
  );
}
