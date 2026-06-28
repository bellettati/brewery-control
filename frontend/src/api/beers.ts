import { api } from "./client";
import type { Beer, CreateBeerRequest, UpdateBeerRequest } from "./types";

export const getBeers = () => api<Beer[]>("/api/beers");
export const getBeer = (id: number) => api<Beer>(`/api/beers/${id}`);
export const createBeer = (body: CreateBeerRequest) =>
  api<Beer>("/api/beers", { method: "POST", body: JSON.stringify(body) });
export const updateBeer = (id: number, body: UpdateBeerRequest) =>
  api<void>(`/api/beers/${id}`, { method: "PUT", body: JSON.stringify(body) });
export const deleteBeer = (id: number) =>
  api<void>(`/api/beers/${id}`, { method: "DELETE" });
