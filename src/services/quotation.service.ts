import { apiFetch } from "~/lib/api";

export interface QuotationItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: string;
}

export interface Quotation {
  id: number;
  quotationNumber: string;
  clientId: number;
  total: string;
  subtotal: string;
  taxTotal: string;
  status: string;
  issueDate: string;
  expiryDate?: string;
  client?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    poBox?: string;
    postalCode?: string;
    city?: string;
    country?: string;
  };
  items?: QuotationItem[];
}

export const quotationService = {
  getAllQuotations: () => apiFetch<Quotation[]>("/quotations"),

  delete: async (id: number) => {
    const response = await fetch(`/api/quotations/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete quotation");
    }

    return await response.json();
  },
  getQuotationById: (id: string | number) => apiFetch<Quotation>(`/quotations/${id}`),

  getStats: () => apiFetch<{
    pendingCount: number;
    totalRevenue: string;
    activeClients: number;
  }>("/quotations/stats"),
};