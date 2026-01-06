import { Show } from "solid-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

export function QuotationDialogs(props: {
  item: any;
  mode: "view" | "edit" | "delete" | null;
  onClose: () => void;
  onConfirmDelete: (id: number) => void;
}) {
  
  // Helper to format currency safely
  const formatCurrency = (amount: number) => {
    if (!amount) return "KES 0.00";
    // Using a fixed locale 'en-KE' ensures server and client output match exactly
    return "KES " + amount.toLocaleString('en-KE', { minimumFractionDigits: 2 });
  };

  return (
    <div id="quotation-dialog-container">
      {/* DELETE CONFIRMATION */}
      <Dialog open={props.mode === "delete"} onOpenChange={props.onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete quotation <span class="font-bold text-slate-900">{props.item?.quotationNumber || 'N/A'}</span>. 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter class="gap-2 sm:gap-0">
            <Button variant="outline" onClick={props.onClose}>Cancel</Button>
            <Button 
               variant="destructive" 
               onClick={() => props.item?.id && props.onConfirmDelete(props.item.id)}
            >
              Delete Quotation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* VIEW DETAILS */}
      <Dialog open={props.mode === "view"} onOpenChange={props.onClose}>
        <DialogContent class="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Quotation Details</DialogTitle>
          </DialogHeader>
          <div class="space-y-6 py-4">
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-1">
                <p class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Number</p>
                <p class="font-medium">{props.item?.quotationNumber}</p>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Status</p>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary capitalize">
                   {props.item?.status}
                </span>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Client</p>
                <p class="font-medium">{props.item?.client?.name || "No Client Assigned"}</p>
              </div>
              <div class="space-y-1">
                <p class="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Amount</p>
                <p class="font-mono text-lg font-bold text-slate-900">
                   {formatCurrency(props.item?.total)}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* EDIT FORM */}
      <Dialog open={props.mode === "edit"} onOpenChange={props.onClose}>
        <DialogContent class="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Edit Quotation</DialogTitle>
          </DialogHeader>
          <div class="p-4 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
             <p class="text-center text-sm text-slate-500 italic">
               The Woodworks Quotation Form will load here...
             </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}