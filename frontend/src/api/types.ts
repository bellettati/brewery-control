export type FermentationStatus =
  | "WithinStandard"
  | "Attention"
  | "OutOfStandard";

export interface Tank {
  id: number;
  name: string;
  capacityLiters: number;
}

export interface Beer {
  id: number;
  name: string;
  style: string;
  tempMin: number;
  tempMax: number;
  phMin: number;
  phMax: number;
  extractMin: number;
  extractMax: number;
}

export interface FermentationRecord {
  id: number;
  beerId: number;
  beerName: string;
  tankId: number;
  tankName: string;
  batchNumber: string;
  temperature: number;
  ph: number;
  extract: number;
  recordedAt: string;
  observation: string | null;
  status: FermentationStatus;
}

export interface DashboardSummary {
  total: number;
  withinStandard: number;
  attention: number;
  outOfStandard: number;
}

export interface CreateTankRequest {
  name: string;
  capacityLiters: number;
}
export interface CreateBeerRequest {
  name: string;
  style: string;
  tempMin: number;
  tempMax: number;
  phMin: number;
  phMax: number;
  extractMin: number;
  extractMax: number;
}
export interface UpdateBeerRequest {
  name: string | null;
  style: string | null;
  tempMin: number | null;
  tempMax: number | null;
  phMin: number | null;
  phMax: number | null;
  extractMin: number | null;
  extractMax: number | null;
}
export interface CreateFermentationRecordRequest {
  beerId: number;
  tankId: number;
  batchNumber: string;
  temperature: number;
  ph: number;
  extract: number;
  recordedAt: string;
  observation: string | null;
}
