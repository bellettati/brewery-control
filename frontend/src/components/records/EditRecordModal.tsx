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
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] }); // status may have changed
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
        <label className="flex flex-col text-sm text-grey">
          Cerveja
          <select
            className="border border-steel rounded px-3 py-2 text-ink"
            value={Number(form.beerId)}
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
        </label>

        <label className="flex flex-col text-sm text-grey">
          Tanque
          <select
            className="border border-steel rounded px-3 py-2 text-ink"
            value={Number(form.tankId)}
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
        </label>

        <label className="flex flex-col text-sm text-grey col-span-2">
          Nº do lote
          <input
            className="border border-steel rounded px-3 py-2 text-ink"
            value={form.batchNumber ?? ""}
            onChange={(e) => update("batchNumber", e.target.value)}
          />
        </label>

        <label className="flex flex-col text-sm text-grey">
          Temperatura (°C)
          <input
            className="border border-steel rounded px-3 py-2 text-ink"
            type="number"
            step="0.1"
            value={form.temperature!}
            onChange={(e) => update("temperature", Number(e.target.value))}
          />
        </label>
        <label className="flex flex-col text-sm text-grey">
          pH
          <input
            className="border border-steel rounded px-3 py-2 text-ink"
            type="number"
            step="0.1"
            value={form.ph!}
            onChange={(e) => update("ph", Number(e.target.value))}
          />
        </label>
        <label className="flex flex-col text-sm text-grey">
          Extrato (°P)
          <input
            className="border border-steel rounded px-3 py-2 text-ink"
            type="number"
            step="0.1"
            value={form.extract!}
            onChange={(e) => update("extract", Number(e.target.value))}
          />
        </label>
        <label className="flex flex-col text-sm text-grey">
          Observações
          <input
            className="border border-steel rounded px-3 py-2 text-ink"
            value={form.observation ?? ""}
            onChange={(e) => update("observation", e.target.value || null)}
          />
        </label>
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
