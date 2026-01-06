import { useParams, useNavigate } from "@solidjs/router";
import { createResource, Show, For, Suspense } from "solid-js";
import { api } from "~/lib/api";
import { Button } from "~/components/ui/button";
import { 
  ArrowLeft, Printer, Mail, 
  FileText, Calendar, User, Hash, CheckCircle2, MapPin, Phone 
} from "lucide-solid";
import { Badge } from "~/components/ui/badge";

export default function InvoiceViewPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [invoice] = createResource(async () => {
    const res = await api.invoices[":id"].$get({
      param: { id: params.id! }
    });
    if (res.ok) return await res.json();
    throw new Error("Invoice not found");
  });

  // ✅ Consistent date formatting to prevent hydration flicker
  const formatDate = (date: string | Date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div class="p-6 max-w-5xl mx-auto space-y-6">
      {/* Action Header */}
      <div class="flex justify-between items-center no-print">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          {ArrowLeft({ size: 18, class: "mr-2" })} Back to List
        </Button>
        <div class="flex gap-3">
          <Button variant="outline" onClick={() => window.print()}>
            {Printer({ size: 18, class: "mr-2" })} Print
          </Button>
          <Button class="bg-slate-900 text-white hover:bg-slate-800">
            {Mail({ size: 18, class: "mr-2" })} Send to Client
          </Button>
        </div>
      </div>

      <Suspense fallback={
        <div class="h-96 flex flex-col items-center justify-center text-slate-300 animate-pulse border-2 border-dashed rounded-2xl">
          {FileText({ size: 48, class: "mb-4 opacity-20" })}
          <p class="font-medium">Preparing document...</p>
        </div>
      }>
        <Show when={invoice()} keyed>
          {(data) => (
            <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden print:border-none print:shadow-none">
              
              {/* Invoice Header Section */}
              <div class="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div>
                  <div class="flex items-center gap-3 mb-2">
                      <div class="bg-slate-900 p-2 rounded-lg text-white">
                          {FileText({ size: 24 })}
                      </div>
                      <h1 class="text-2xl font-bold text-slate-900 uppercase tracking-tight">Invoice</h1>
                  </div>
                  <p class="text-slate-500 text-sm font-mono flex items-center gap-2">
                      {Hash({ size: 14 })} {data.invoiceNumber}
                  </p>
                </div>
                <div class="text-right space-y-2">
                  <Badge 
                    variant={data.status === 'paid' ? 'default' : 'outline'} 
                    class={`uppercase px-3 py-1 ${data.status === 'paid' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
                  >
                    {data.status}
                  </Badge>
                  <div class="text-xs text-slate-400 space-y-1">
                      <p class="flex items-center justify-end gap-2 text-slate-600">
                        Issued: {formatDate(data.issueDate)} {Calendar({ size: 12 })}
                      </p>
                      <p class="flex items-center justify-end gap-2 text-red-600 font-semibold uppercase tracking-tight">
                        Due: {formatDate(data.dueDate)} {Calendar({ size: 12 })}
                      </p>
                  </div>
                </div>
              </div>

              <div class="p-8 grid grid-cols-2 gap-12 border-b border-slate-50">
                {/* From Section */}
                <div class="space-y-3">
                  <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">From</h3>
                  <div class="text-sm">
                    <p class="font-bold text-slate-900 text-lg">Brandflare Woodworks</p>
                    <p class="text-slate-500 flex items-center gap-2">{MapPin({ size: 14 })} 123 Carpentry Lane, Nairobi</p>
                    <p class="text-slate-500 flex items-center gap-2">{Phone({ size: 14 })} +254 700 000 000</p>
                  </div>
                </div>

                {/* Bill To Section */}
                <div class="space-y-3">
                  <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bill To</h3>
                  <div class="text-sm">
                    <p class="font-bold text-slate-900 text-lg flex items-center gap-2 mb-1">
                      {User({ size: 16, class: "text-slate-400" })} {data.client?.name}
                    </p>
                    
                    <div class="space-y-1 text-slate-600">
                      <p class="flex items-start gap-2">
                         {MapPin({ size: 14, class: "mt-1 text-slate-400" })}
                         <span>
                           {data.client?.poBox && `P.O. Box ${data.client.poBox}, `}
                           {data.client?.postalCode && `${data.client.postalCode} `}
                           <br />
                           {data.client?.city}, {data.client?.country || 'Kenya'}
                         </span>
                      </p>
                      <p class="flex items-center gap-2 text-slate-500">
                        {Phone({ size: 14, class: "text-slate-400" })} {data.client?.phone || 'No phone provided'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div class="px-8 py-4">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th class="py-4 text-left font-bold">Description</th>
                      <th class="py-4 text-center font-bold w-24">Qty</th>
                      <th class="py-4 text-right font-bold w-32">Unit Price</th>
                      <th class="py-4 text-right font-bold w-32">Amount</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50">
                    <For each={data.items}>
                      {(item) => (
                        <tr class="hover:bg-slate-50/30 transition-colors">
                          <td class="py-5">
                            <p class="font-semibold text-slate-900">{item.description}</p>
                            <p class="text-[10px] text-slate-400 uppercase font-medium">Unit: {item.unitOfMeasurement || 'pcs'}</p>
                          </td>
                          <td class="py-5 text-center text-slate-600 font-medium">{item.quantity}</td>
                          <td class="py-5 text-right text-slate-600 font-mono">
                            {Number(item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td class="py-5 text-right text-slate-900 font-bold font-mono">
                            {(Number(item.unitPrice) * (item.quantity || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div class="p-8 bg-slate-50/50 flex justify-end">
                <div class="w-80 space-y-3">
                  <div class="flex justify-between text-xs font-bold uppercase text-slate-400 tracking-tight">
                    <span>Subtotal</span>
                    <span class="text-slate-900 font-mono">{Number(data.subtotal || 0).toLocaleString()}</span>
                  </div>
                  <div class="flex justify-between text-xs font-bold uppercase text-slate-400 tracking-tight">
                    <span>VAT (16%)</span>
                    <span class="text-slate-900 font-mono">{Number(data.taxTotal || 0).toLocaleString()}</span>
                  </div>
                  <div class="pt-4 border-t-2 border-slate-200 flex justify-between items-baseline">
                    <span class="font-black text-slate-900 uppercase text-xs tracking-widest">Total {data.currency || 'KES'}</span>
                    <span class="text-3xl font-black text-slate-900 font-mono tracking-tighter">
                      {Number(data.total || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer / Terms */}
              <div class="p-8 text-[10px] text-slate-400 border-t border-slate-100 bg-white">
                  <div class="flex items-center gap-2 mb-2 text-slate-600 font-bold uppercase tracking-widest">
                      {CheckCircle2({ size: 12, class: "text-emerald-600" })} Payment Details
                  </div>
                  <div class="grid grid-cols-2 gap-8">
                     <div class="p-3 bg-slate-50 rounded-lg">
                        <p class="font-bold text-slate-700 mb-1">M-PESA TILL</p>
                        <p class="text-lg font-mono text-slate-900 font-black">123456</p>
                        <p>Name: Brandflare Woodworks</p>
                     </div>
                     <div class="p-3 bg-slate-50 rounded-lg">
                        <p class="font-bold text-slate-700 mb-1">BANK TRANSFER</p>
                        <p class="font-bold text-slate-900">KCB Bank • Acc: 1100223344</p>
                        <p>Branch: Nairobi Main • SWIFT: KCBLKENX</p>
                     </div>
                  </div>
                  <p class="mt-6 text-center italic border-t pt-4">This is a computer generated invoice and does not require a signature.</p>
              </div>
            </div>
          )}
        </Show>
      </Suspense>

      {/* Print-only CSS */}
      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            body { background: white !important; padding: 0 !important; margin: 0 !important; }
            .p-6 { padding: 0 !important; }
            .max-w-5xl { max-width: 100% !important; margin: 0 !important; }
            .bg-white { border: none !important; }
            .shadow-sm { box-shadow: none !important; }
            .rounded-2xl { border-radius: 0 !important; }
            .bg-slate-50\/50 { background-color: transparent !important; }
          }
        `}
      </style>
    </div>
  );
}