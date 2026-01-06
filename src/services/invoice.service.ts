// src/services/invoice.service.ts

export interface DashboardStats {
  weeklyPayments: number;
  totalEmployees: number;
  revenueMTD: number;
  pendingPayments: number;
  activeClients: number;
  weeklyTrend: { day: string; amount: number }[];
}

// Helper to handle Server vs Client URLs
const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // Browser can handle relative paths
  // On server, use the environment variable or default to localhost
  return process.env.URL || "http://localhost:3000"; 
};

export const invoiceService = {
  async getStats(): Promise<DashboardStats> {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/invoices/stats`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    return response.json();
  }
};