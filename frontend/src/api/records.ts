import { api } from "./client";
import type {
  FermentationRecord,
  CreateFermentationRecordRequest,
  UpdateFermentationRecordRequest,
} from "./types";

export const getRecords = () =>
  api<FermentationRecord[]>("/api/fermentation-records");
export const getRecordsByBatch = (batch: string) =>
  api<FermentationRecord[]>(`/api/fermentation-records/batch/${batch}`);
export const createRecord = (body: CreateFermentationRecordRequest) =>
  api<FermentationRecord>("/api/fermentation-records", {
    method: "POST",
    body: JSON.stringify(body),
  });
export const updateRecord = (
  id: number,
  body: UpdateFermentationRecordRequest,
) =>
  api<void>(`/api/fermentation-records/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
export const deleteRecord = (id: number) =>
  api<void>(`/api/fermentation-records/${id}`, { method: "DELETE" });
