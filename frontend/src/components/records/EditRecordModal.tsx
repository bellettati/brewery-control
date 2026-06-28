import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateRecord } from "../../api/records";
import { getBeers } from "../../api/beers";
import { getTanks } from "../../api/tanks";
import { Modal } from "../Modal";
import { useState } from "react";
import type {
  FermentationRecord,
  UpdateFermentationRecordRequest,
} from "../../api/types";
import { validateRecord } from "./validateRecord";
import { Field } from "../Field";
import { TextInput } from "../inputs/TextInput";
import { NumberInput } from "../inputs/NumberInput";
import { Select } from "../inputs/Select";
import { Button } from "../inputs/Button";

export function EditRecordModal({
  record,
  onClose,
}: {
  record: FermentationRecord;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const { data: beers } = useQuery({ queryKey: ["beers"], queryFn: getBeers });
  const { data: tanks } = useQuery({ queryKey: ["tanks"], queryFn: getTanks });
  const [attempted, setAttempted] = useState(false);

  const [form, setForm] = useState<UpdateFermentationRecordRequest>({
    beerId: record.beerId,
    tankId: record.tankId,
    batchNumber: record.batchNumber,
    temperature: record.temperature,
    ph: record.ph,
    extract: record.extract,
    recordedAt: record.recordedAt,
    observation: record.observation,
  });

  const errors = validateRecord({
    beerId: form.beerId!,
    tankId: form.tankId!,
    batchNumber: form.batchNumber ?? "",
    temperature: form.temperature!,
    ph: form.ph!,
    extract: form.extract!,
  });

  const mutation = useMutation({
    mutationFn: () => updateRecord(record.id, form),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["records"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onClose();
    },
  });

  function update<K extends keyof UpdateFermentationRecordRequest>(
    key: K,
    value: UpdateFermentationRecordRequest[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit() {
    setAttempted(true);
    if (errors.length === 0) mutation.mutate();
  }

  return (
    <Modal
      title={`Editar registro · lote ${record.batchNumber}`}
      onClose={onClose}
    >
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field label="Cerveja" required>
          <Select
            value={Number(form.beerId)}
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
            value={Number(form.tankId)}
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

        <div className="col-span-2">
          <Field label="Nº do lote" required>
            <TextInput
              value={form.batchNumber ?? ""}
              onChange={(v) => update("batchNumber", v)}
            />
          </Field>
        </div>

        <Field label="Temperatura (°C)" required>
          <NumberInput
            value={form.temperature!}
            onChange={(v) => update("temperature", v)}
          />
        </Field>
        <Field label="pH" required>
          <NumberInput value={form.ph!} onChange={(v) => update("ph", v)} />
        </Field>
        <Field label="Extrato (°P)" required>
          <NumberInput
            value={form.extract!}
            onChange={(v) => update("extract", v)}
          />
        </Field>
        <Field label="Observações">
          <TextInput
            value={form.observation ?? ""}
            onChange={(v) => update("observation", v || null)}
          />
        </Field>
      </div>

      <div className="bg-status-attention/20 border border-status-attention rounded p-3 text-sm text-ink mb-4">
        A classificação será recalculada automaticamente ao salvar.
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
