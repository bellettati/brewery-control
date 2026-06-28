import { api } from "./client";
import type { Tank, CreateTankRequest, UpdateTankRequest } from "./types";

export const getTanks = () => api<Tank[]>("/api/tanks");
export const getTank = (id: number) => api<Tank[]>(`/api/tanks/${id}`);
export const createTank = (body: CreateTankRequest) =>
  api<Tank[]>(`/api/tanks/`, { method: "POST", body: JSON.stringify(body) });
export const updateTank = (id: number, body: UpdateTankRequest) =>
  api<void>(`/api/tanks/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteTank = (id: number) =>
  api<void>(`/api/tanks/${id}`, { method: "DELETE" });
