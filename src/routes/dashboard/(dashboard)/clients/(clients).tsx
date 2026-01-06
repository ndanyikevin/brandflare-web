import { createResource, createSignal, Show } from "solid-js";
import { api } from "~/lib/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { 
  Search, 
  Mail, 
  Phone, 
  Pencil, 
  Trash2, 
  Home, 
  Eye
} from "lucide-solid";
import { TableRow, TableCell } from "~/components/ui/table";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { DataTable } from "~/components/dashboard/DataTable";
import { useNavigate } from "@solidjs/router";

export default function ClientsPage() {
  const navigate = useNavigate();
  const [fetchParams, setFetchParams] = createSignal({ 
    q: "", 
    p: 1, 
    s: "name" 
  });
  
  let searchInput!: HTMLInputElement;

  /* ---------------- RESOURCE ---------------- */
  const [clients, { mutate, refetch }] = createResource(
    fetchParams,
    async ({ q, p, s }) => {
      const res = await api.clients.$get({
        query: {
          search: q,
          page: p.toString(),
          sort: s,
        },
      });
      return res.ok ? await res.json() : [];
    },
    { initialValue: [] }
  );

  const handleSearch = (e: Event) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    // Only update if the query actually changed or to reset pagination
    setFetchParams(prev => ({
      ...prev,
      q: query,
      p: 1 
    }));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this client? This action cannot be undone.")) return;

    try {
      const res = await api.clients[":id"].$delete({
        param: { id: id.toString() },
      });

      if (res.ok) {
        // Optimistic UI update
        mutate((prev) => prev?.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete client. They might have active invoices.");
      }
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div class="space-y-6">
      <PageHeader 
        title="Clients"
        description="Manage your customer directory and billing addresses."
        buttonText="Add Client"
        onAction={() => navigate(`/dashboard/clients/new-client`)}
      />

      <div class="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <form class="flex flex-1 gap-2" onSubmit={handleSearch}>
          <div class="relative flex-1">
            {Search({ 
              size: 18, 
              class: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
            })}
            <Input
              ref={searchInput}
              type="text"
              placeholder="Search by name, email or phone..."
              class="pl-10 border-slate-200 focus:ring-primary"
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
            />
          </div>
          <Button 
            type="submit" 
            variant="secondary"
            class="px-6"
          >
            Search
          </Button>
        </form>
      </div>

      <DataTable
        data={clients}
        refetch={refetch}
        columns={[
          { label: "Client Name", sortKey: "name" },
          { label: "Contact Info" },
          { label: "Address (P.O. Box)" },
          { label: "Actions" },
        ]}
        renderRow={(client) => (
          <TableRow class="hover:bg-slate-50/50 group transition-colors">
            <TableCell>
              <div class="font-bold text-slate-900">{client.name}</div>
              <div class="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">REF-CL-{client.id}</div>
            </TableCell>
            
            <TableCell>
              <div class="text-xs space-y-1.5 text-slate-600">
                <div class="flex gap-2 items-center">
                  {Mail({ size: 12, class: "text-slate-400" })} 
                  <span class="truncate max-w-[180px]">{client.email || 'No email'}</span>
                </div>
                <div class="flex gap-2 items-center">
                  {Phone({ size: 12, class: "text-slate-400" })} {client.phone || 'No phone'}
                </div>
              </div>
            </TableCell>

            <TableCell class="text-xs text-slate-600">
              <div class="flex gap-2">
                {Home({ size: 12, class: "mt-0.5 text-slate-400 shrink-0" })}
                <div class="flex flex-col">
                  <Show when={client.poBox} fallback={<span class="text-slate-300 italic">No P.O. Box</span>}>
                    <span class="font-mono text-[11px]">P.O. Box {client.poBox}</span>
                  </Show>
                  <span class="font-bold text-slate-900">
                    {client.postalCode} {client.city}
                  </span>
                  <span class="text-[10px] uppercase text-slate-400 font-medium">{client.country || 'Kenya'}</span>
                </div>
              </div>
            </TableCell>

            <TableCell class="text-right">
              <div class="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    class="h-8 w-8 text-slate-400 hover:text-slate-900"
                    onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                  >
                    {Eye({ size: 16 })}
                  </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  class="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5"
                  onClick={() => navigate(`/dashboard/clients/${client.id}/edit`)}
                >
                  {Pencil({ size: 16 })}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  class="h-8 w-8 text-slate-400 hover:text-destructive hover:bg-destructive/5"
                  onClick={() => handleDelete(client.id)}
                >
                  {Trash2({ size: 16 })}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
}