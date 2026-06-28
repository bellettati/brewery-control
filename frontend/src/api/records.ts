import { api } from "./client";
import type {
  FermentationRecord,
  CreateFermentationRecordRequest,
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
