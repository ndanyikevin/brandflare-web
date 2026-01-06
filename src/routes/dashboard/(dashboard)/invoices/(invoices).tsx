import { createResource, createSignal, Show } from "solid-js";
import { api } from "~/lib/api";
import { useNavigate } from "@solidjs/router";
import { 
  Plus, 
  Eye, 
  Download,
  Calendar
} from "lucide-solid";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { TableRow, TableCell } from "~/components/ui/table";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { DataTable } from "~/components/dashboard/DataTable";

export default function InvoicesPage() {
  const navigate = useNavigate();
  const [fetchParams] = createSignal({ q: "", p: 1, s: "createdAt" });

  const [invoices, { refetch }] = createResource(
    fetchParams,
    async ({ q, p, s }) => {
      const res = await api.invoices.$get();
      return res.ok ? await res.json() : [];
    },
    { initialValue: [] }
  );

  // Helper for consistent date formatting
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-KE");
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div class="space-y-6">
      <PageHeader 
        title="Invoices"
        description="Track billing, payments, and outstanding balances."
        buttonText="Create Invoice"
        onAction={() => navigate("/dashboard/invoices/new-invoice")}
        icon={Plus({ size: 18 })}
      />

      <DataTable
        data={invoices}
        refetch={refetch}
        columns={[
          { label: "Invoice #", sortKey: "invoiceNumber" },
          { label: "Client" },
          { label: "Amount", sortKey: "total" },
          { label: "Issued / Due" },
          { label: "Status" },
          { label: "Actions" }, 
        ]}
        renderRow={(invoice) => (
          <TableRow class="group hover:bg-slate-50/50">
            <TableCell>
              <div class="font-mono text-sm font-bold text-slate-900">
                {invoice.invoiceNumber}
              </div>
              <div class="text-[10px] text-slate-400 uppercase tracking-tight">Ref: {invoice.quotationRef || 'N/A'}</div>
            </TableCell>

            <TableCell>
              <div class="font-medium text-slate-700">{invoice.client?.name}</div>
              <div class="text-xs text-slate-400">{invoice.client?.email}</div>
            </TableCell>

            <TableCell>
              <div class="font-bold text-slate-900">
                {Number(invoice.total || 0).toLocaleString()} 
                <span class="text-[10px] ml-1 text-slate-400">{invoice.currency || 'KES'}</span>
              </div>
            </TableCell>

            <TableCell>
              <div class="flex items-center gap-2 text-xs text-slate-600">
                {Calendar({ size: 12, class: "text-slate-400" })}
                <span>{formatDate(invoice.issueDate)}</span>
              </div>
              <div class="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-tighter">
                Due: {formatDate(invoice.dueDate)}
              </div>
            </TableCell>

            <TableCell>
              <Show when={invoice.status === "paid"}>
                <Badge class="bg-emerald-50 text-emerald-700 border-emerald-100 uppercase text-[10px] font-bold">Paid</Badge>
              </Show>
              <Show when={invoice.status === "draft"}>
                <Badge variant="secondary" class="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold">Draft</Badge>
              </Show>
              <Show when={invoice.status === "overdue"}>
                <Badge class="bg-red-50 text-red-700 border-red-100 uppercase text-[10px] font-bold">Overdue</Badge>
              </Show>
              <Show when={!["paid", "draft", "overdue"].includes(invoice.status || "")}>
                <Badge variant="outline" class="uppercase text-[10px] font-bold">{invoice.status}</Badge>
              </Show>
            </TableCell>

            <TableCell class="text-right">
              <div class="flex justify-end gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  class="h-8 w-8 rounded-full"
                  onClick={() => navigate(`/dashboard/invoices/${invoice.id}`)}
                >
                  {Eye({ size: 16, class: "text-slate-400 hover:text-primary transition-colors" })}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  class="h-8 w-8 rounded-full"
                >
                  {Download({ size: 16, class: "text-slate-400 hover:text-slate-600 transition-colors" })}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
}