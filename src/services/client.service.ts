import { apiFetch } from "~/lib/api";

export interface Client {
  id: number;
  name: string;
  email: string;
  city: string;
}

export const clientService = {
  getAll: () => apiFetch<Client[]>("/clients"),
};