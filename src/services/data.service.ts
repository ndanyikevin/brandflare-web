// src/services/data.service.ts

export interface Employee { id: number; firstName: string; lastName: string; role: string; }
export interface Client { id: number; name: string; }
export interface Invoice { id: number; totalAmount: string | number; status: string; createdAt: string; }
export interface Task { id: number; title: string; cost: number; }

export interface BrandflareData {
  employees: Employee[];
  clients: Client[];
  invoices: Invoice[];
  tasks: Task[];
}

export const dataService = {
  async getDashboardData(): Promise<BrandflareData> {
    const HONO_URL = "http://localhost:5000";

    // Aligned with your .route() mounts in routes.ts
    const [empRes, cliRes, invRes, taskRes] = await Promise.all([
      fetch(`${HONO_URL}/api/employees`),
      fetch(`${HONO_URL}/api/clients`),
      fetch(`${HONO_URL}/api/invoices`),
      fetch(`${HONO_URL}/api/tasks`)
    ]);

    const safeParse = async (res: Response) => {
      if (!res.ok) return [];
      try {
        return await res.json();
      } catch {
        return [];
      }
    };

    return {
      employees: await safeParse(empRes),
      clients: await safeParse(cliRes),
      invoices: await safeParse(invRes),
      tasks: await safeParse(taskRes),
    };
  }
};