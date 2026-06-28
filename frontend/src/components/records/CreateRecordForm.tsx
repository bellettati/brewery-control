import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRecord } from "../../api/records";
import { getBeers } from "../../api/beers";
import { getTanks } from "../../api/tanks";
import { useState } from "react";
import type { CreateFermentationRecordRequest } from "../../api/types";
import { validateRecord } from "./validateRecord";

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

  // dropdowns are fed by their own queries — reusing the cache from the other screens
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
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // counts changed too
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

  // a date is always set (defaults to now); only override if the user picks one
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
          <select
            className="border border-steel rounded px-3 py-2 text-ink w-full"
            value={form.beerId}
            onChange={(e) => update("beerId", Number(e.target.value))}
          >
            <option value={0} disabled>
              Selecione a cerveja
            </option>
            {beers?.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Tanque" required>
          <select
            className="border border-steel rounded px-3 py-2 text-ink w-full"
            value={form.tankId}
            onChange={(e) => update("tankId", Number(e.target.value))}
          >
            <option value={0} disabled>
              Selecione o tanque
            </option>
            {tanks?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Nº do lote" required>
          <input
            className="border border-steel rounded px-3 py-2 text-ink w-full"
            value={form.batchNumber}
            onChange={(e) => update("batchNumber", e.target.value)}
          />
        </Field>

        <Field label="Temperatura (°C)" required>
          <input
            className="border border-steel rounded px-3 py-2 text-ink w-full"
            type="number"
            step="0.1"
            value={form.temperature}
            onChange={(e) => update("temperature", Number(e.target.value))}
          />
        </Field>

        <Field label="pH" required>
          <input
            className="border border-steel rounded px-3 py-2 text-ink w-full"
            type="number"
            step="0.1"
            value={form.ph}
            onChange={(e) => update("ph", Number(e.target.value))}
          />
        </Field>

        <Field label="Extrato (°P)" required>
          <input
            className="border border-steel rounded px-3 py-2 text-ink w-full"
            type="number"
            step="0.1"
            value={form.extract}
            onChange={(e) => update("extract", Number(e.target.value))}
          />
        </Field>

        <Field
          label="Data e hora"
          hint="Se vazio, será usada a data/hora atual."
        >
          <input
            className="border border-steel rounded px-3 py-2 text-ink w-full"
            type="datetime-local"
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </Field>

        <div className="col-span-2">
          <Field label="Observações">
            <input
              className="border border-steel rounded px-3 py-2 text-ink w-full"
              value={form.observation ?? ""}
              onChange={(e) => update("observation", e.target.value || null)}
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

      <button
        className="bg-brand text-ink font-semibold px-4 py-2 rounded disabled:opacity-50 mt-3"
        disabled={mutation.isPending}
        onClick={handleSubmit}
      >
        {mutation.isPending ? "Salvando..." : "Registrar"}
      </button>
    </div>
  );
}

// label wrapper: red asterisk for required, optional helper text below
function Field({
  label,
  required = false,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col text-sm text-grey">
      <span>
        {label}
        {required && <span className="text-status-out"> *</span>}
      </span>
      {children}
      {hint && <span className="text-xs text-grey mt-1">{hint}</span>}
    </label>
  );
}
