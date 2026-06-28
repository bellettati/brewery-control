import { api } from "./client";
import type { DashboardSummary } from "./types";

export const getDashboard = () => api<DashboardSummary>("/api/dashboard");
