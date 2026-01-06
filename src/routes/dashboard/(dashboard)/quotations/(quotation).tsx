import { createResource, createSignal, Show } from "solid-js";
import { quotationService } from "~/services/quotation.service";
import { TableCell, TableRow } from "~/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem 
} from "~/components/ui/dropdown-menu";
import { 
  Pencil, Trash2, Eye, 
  ArrowRight 
} from "lucide-solid";
import { Button } from "~/components/ui/button";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { DataTable } from "~/components/dashboard/DataTable";
import { useNavigate } from "@solidjs/router";
import { QuotationDialogs } from "~/components/dashboard/QuotationsDialog";

export default function QuotationsPage() {
  const navigate = useNavigate();
  const [quotations, { refetch }] = createResource(quotationService.getAllQuotations);

  // ✅ Moved signals inside the component to prevent cross-request state pollution
  const [activeItem, setActiveItem] = createSignal<any>(null);
  const [dialogMode, setDialogMode] = createSignal<"view" | "edit" | "delete" | null>(null);

  const closeDialogs = () => {
    setDialogMode(null);
    setActiveItem(null);
  };

  const handleDelete = async (id: number) => {
    // Optional: Add a confirmation check if not using the Dialog mode
    const ok = confirm("Are you sure you want to delete this quotation?");
    if (!ok) return;
    
    await quotationService.delete(id);
    refetch();
    closeDialogs();
  };

  return (
    <div class="space-y-6">
      <PageHeader 
        title="Quotations"
        description="Review workshop estimates and client orders."
        buttonText="New Quote"
        onAction={() => navigate("/dashboard/quotations/new-quotation")}
      />

      <DataTable
        data={quotations}
        refetch={refetch}
        columns={[
          { label: "Number", sortKey: "quotationNumber" },
          { label: "Client", sortKey: "client.name" },
          { label: "Total", sortKey: "total" },
          { label: "Status", sortKey: "status" },
          { label: "Actions" },
        ]}
        renderRow={(quote) => (
          <TableRow>
            <TableCell class="font-medium text-slate-900">
              {quote.quotationNumber}
            </TableCell>
            <TableCell>{quote.client?.name || "Unknown Client"}</TableCell>
            <TableCell>
              KES {Number(quote.total || 0).toLocaleString()}
            </TableCell>
            <TableCell>
              <span class="capitalize px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                {quote.status}
              </span>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                {/* Note: Passing 'as={Button}' is good, 
                  but we must call the icon as a function 
                */}
                <DropdownMenuTrigger 
                  as={Button} 
                  variant="ghost" 
                  size="sm" 
                  class="h-8 w-8 p-0"
                >
                  {ArrowRight({ size: 16 })}
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-40">
                  <DropdownMenuItem 
                    onClick={() => navigate(`/dashboard/quotations/${quote.id}`)}
                    class="cursor-pointer"
                  >
                    {Eye({ size: 14, class: "mr-2" })} View
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => navigate(`/dashboard/quotations/edit/${quote.id}`)}
                    class="cursor-pointer"
                  >
                    {Pencil({ size: 14, class: "mr-2" })} Edit
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    class="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer" 
                    onClick={() => handleDelete(quote.id)}
                  >
                    {Trash2({ size: 14, class: "mr-2" })} Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        )}
      />

      <QuotationDialogs 
        item={activeItem()} 
        mode={dialogMode()} 
        onClose={closeDialogs}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}