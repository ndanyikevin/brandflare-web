import { useNavigate, useParams } from "@solidjs/router";
import { ArrowLeft, Edit, Trash2, Pencil, Download } from "lucide-solid";
import { createResource, Show, ErrorBoundary, Suspense, For } from "solid-js";
import { PageHeader } from "~/components/dashboard/PageHeader";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { quotationService } from "~/services/quotation.service";
import DataError from "~/components/dashboard/DataError";
import { generatePDF } from "~/lib/pdf";

export default function ViewQuotationPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [quotation, { refetch }] = createResource(
    () => params.id,
    (id) => quotationService.getQuotationById(id)
  );

  const handleDownloadPDF = async () => {
    const q = quotation();
    if (!q) return;
    // Ensure the ID matches the wrapper around your Document Content for PDF generation
    await generatePDF("quotation-content", `Quotation-${q.quotationNumber}`);
  };

  // Helper for consistent date formatting to avoid hydration flicker
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-KE"); // Locked to Kenya locale for consistency
  };

  return (
    <div class="space-y-6 max-w-5xl mx-auto">
      <PageHeader
        title={quotation()?.quotationNumber || "Quotation Details"}
        description="Review and manage workshop estimate"
        buttonText="Back to List"
        onAction={() => navigate("/dashboard/quotations")}
        // ✅ Icon passed as a function call for hydration safety
        icon={ArrowLeft({ size: 18 })}
      />

      <ErrorBoundary fallback={(err, reset) => <DataError error={err} reset={() => { reset(); refetch(); }} />}>
        <Suspense fallback={<div class="h-64 animate-pulse bg-slate-100 rounded-xl border" />}>
          <Show when={quotation()} fallback={
            <div class="p-12 text-center border rounded-xl bg-white text-slate-500">
              Quotation not found or has been removed.
            </div>
          }>

            {/* Action Bar */}
            <div class="flex justify-between items-center bg-white p-4 border rounded-xl shadow-sm">
              <div class="flex items-center gap-3">
                <Badge variant="outline" class="uppercase bg-slate-50 text-slate-700 font-bold tracking-wider">
                  {quotation()?.status}
                </Badge>
                <span class="text-xs text-slate-400 font-medium uppercase tracking-tight">
                  Issued: {formatDate(quotation()?.issueDate)}
                </span>
              </div>
              <div class="flex gap-2">
                <Button variant="outline" onClick={handleDownloadPDF} class="gap-2">
                  {Download({ size: 16 })} Print / PDF
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => navigate(`/dashboard/quotations/edit/${params.id}`)}
                  class="gap-2"
                >
                  {Pencil({ size: 16 })} Edit Quote
                </Button>
              </div>
            </div>

            {/* Document Content - Added ID for the PDF Generator */}
            <div id="quotation-content" class="bg-white border rounded-xl shadow-sm p-12 text-slate-900 overflow-hidden">
              <div class="flex justify-between mb-12">
                <div>
                  <h2 class="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">BrandFlare</h2>
                  <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Woodworks & Custom Joinery</p>
                  <div class="mt-4 text-sm text-slate-500">
                    <p>Industrial Area, Road A</p>
                    <p>Nairobi, Kenya</p>
                  </div>
                </div>
                <div class="text-right">
                  <h3 class="text-xl font-bold uppercase tracking-widest text-slate-400 mb-1">Quotation</h3>
                  <p class="font-mono text-lg font-bold">{quotation()?.quotationNumber}</p>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-8 mb-12 border-y border-slate-100 py-8">
                <div>
                  <p class="text-[10px] uppercase text-slate-400 font-black mb-2 tracking-widest">Client Details:</p>
                  <p class="font-bold text-slate-900 text-lg">{quotation()?.client?.name}</p>
                  <p class="text-sm text-slate-600">P.O BOX {`${quotation()?.client?.poBox || ''}, ${quotation()?.client?.postalCode || ''}`}</p>
                  <p class="text-sm text-slate-600">{quotation()?.client?.city}, Kenya</p>
                </div>
                <div class="text-right flex flex-col justify-end">
                  <p class="text-[10px] uppercase text-slate-400 font-black mb-1 tracking-widest">Validity:</p>
                  <p class="text-sm font-bold">Valid Until: {formatDate(quotation()?.expiryDate)}</p>
                </div>
              </div>

              {/* Items Table */}
              <div class="mb-12">
                <table class="w-full">
                  <thead>
                    <tr class="border-b-2 border-slate-900 text-left text-[10px] uppercase font-black text-slate-900 tracking-widest">
                      <th class="py-3">Description</th>
                      <th class="py-3 text-center w-24">Qty</th>
                      <th class="py-3 text-right w-32">Unit Price</th>
                      <th class="py-3 text-right w-40">Amount</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <For each={quotation()?.items}>
                      {(item) => (
                        <tr class="group">
                          <td class="py-5 pr-4 text-sm font-medium text-slate-700">{item.description}</td>
                          <td class="py-5 text-center text-sm text-slate-600">{item.quantity}</td>
                          <td class="py-5 text-right text-sm text-slate-600">
                            {Number(item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td class="py-5 text-right text-sm font-bold text-slate-900">
                            KES {(item.quantity * Number(item.unitPrice)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>

              {/* Totals Section */}
              <div class="flex justify-end">
                <div class="w-80 space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <div class="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
                    <span>Subtotal</span>
                    <span>KES {Number(quotation()?.subtotal ?? 0).toLocaleString()}</span>
                  </div>
                  <div class="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-tighter">
                    <span>VAT (0%)</span>
                    <span>KES {Number(quotation()?.taxTotal ?? 0).toLocaleString()}</span>
                  </div>
                  <div class="flex justify-between font-black text-xl border-t border-slate-200 pt-4 text-slate-900">
                    <span>Total</span>
                    <span class="text-slate-900">KES {Number(quotation()?.total ?? 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div class="mt-20 border-t border-slate-100 pt-8">
                <p class="text-[10px] text-slate-400 leading-relaxed max-w-2xl">
                  <strong>Terms & Conditions:</strong> This quotation is valid for 30 days. 
                  A 50% deposit is required to commence works. Delivery timelines will be 
                  confirmed upon receipt of deposit. Items remain property of BrandFlare 
                  until full payment is cleared.
                </p>
              </div>
            </div>
          </Show>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}