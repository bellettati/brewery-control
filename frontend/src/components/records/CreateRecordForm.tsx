import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRecord } from "../../api/records";
import { getBeers } from "../../api/beers";
import { getTanks } from "../../api/tanks";
import { useState } from "react";
import type { CreateFermentationRecordRequest } from "../../api/types";
import { validateRecord } from "./validateRecord";
import { Field } from "../Field";
import { TextInput } from "../inputs/TextInput";
import { NumberInput } from "../inputs/NumberInput";
import { Select } from "../inputs/Select";
import { Button } from "../inputs/Button";

const empty: CreateFermentationRecordRequest = {
  beerId: 0,
  tankId: 0,
  batchNumber: "",
  temperature: 0,
  ph: 0,
  extract: 0,
  recordedAt: new Date().toISOString(),
  observation: null,
};

export function CreateRecordForm() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(empty);
  const [attempted, setAttempted] = useState(false);

  const { data: beers } = useQuery({ queryKey: ["beers"], queryFn: getBeers });
  const { data: tanks } = useQuery({ queryKey: ["tanks"], queryFn: getTanks });

  const errors = validateRecord({
    beerId: form.beerId,
    tankId: form.tankId,
    batchNumber: form.batchNumber,
    temperature: form.temperature,
    ph: form.ph,
    extract: form.extract,
  });

  const mutation = useMutation({
    mutationFn: createRecord,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["records"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setForm({ ...empty, recordedAt: new Date().toISOString() });
      setAttempted(false);
    },
  });

  function update<K extends keyof CreateFermentationRecordRequest>(
    key: K,
    value: CreateFermentationRecordRequest[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit() {
    setAttempted(true);
    if (errors.length === 0) mutation.mutate(form);
  }

  function handleDateChange(value: string) {
    update(
      "recordedAt",
      value ? new Date(value).toISOString() : new Date().toISOString(),
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-3 gap-3">
        <Field label="Cerveja" required>
          <Select
            value={form.beerId}
            onChange={(v) => update("beerId", Number(v))}
          >
            <option value={0} disabled>
              Selecione a cerveja
            </option>
            {beers?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Tanque" required>
          <Select
            value={form.tankId}
            onChange={(v) => update("tankId", Number(v))}
          >
            <option value={0} disabled>
              Selecione o tanque
            </option>
            {tanks?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Nº do lote" required>
          <TextInput
            value={form.batchNumber}
            onChange={(v) => update("batchNumber", v)}
          />
        </Field>

        <Field label="Temperatura (°C)" required>
          <NumberInput
            value={form.temperature}
            onChange={(v) => update("temperature", v)}
          />
        </Field>
        <Field label="pH" required>
          <NumberInput value={form.ph} onChange={(v) => update("ph", v)} />
        </Field>
        <Field label="Extrato (°P)" required>
          <NumberInput
            value={form.extract}
            onChange={(v) => update("extract", v)}
          />
        </Field>

        <Field
          label="Data e hora"
          hint="Se vazio, será usada a data/hora atual."
        >
          <input
            className="border border-steel rounded-lg px-3 py-2 text-ink w-full
                       focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
            type="datetime-local"
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </Field>

        <div className="col-span-2">
          <Field label="Observações">
            <TextInput
              value={form.observation ?? ""}
              onChange={(v) => update("observation", v || null)}
            />
          </Field>
        </div>
      </div>

      {attempted && errors.length > 0 && (
        <ul className="text-status-out text-sm mt-3 list-disc pl-5">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <Button
        onClick={handleSubmit}
        disabled={mutation.isPending}
        className="mt-3"
      >
        {mutation.isPending ? "Salvando..." : "Registrar"}
      </Button>
    </div>
  );
}
