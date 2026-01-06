import { useNavigate } from "@solidjs/router";
import { createSignal, For, Show, createResource, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { api } from "~/lib/api"; 
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { 
  Trash2, Plus, Save, ArrowLeft, 
  Loader2, FileText, AlertCircle, X, Calendar, User 
} from "lucide-solid";

export default function CreateInvoicePage() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
  const [selectedClientId, setSelectedClientId] = createSignal<number | null>(null);

  // ✅ Memoize today's date for hydration safety
  const todayDate = createMemo(() => new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  }));

  const [clientsData] = createResource(async () => {
    try {
      const res = await api.clients.$get();
      if (res.ok) return await res.json();
      return [];
    } catch (e) { 
      console.error("Failed to fetch clients", e);
      return []; 
    }
  });

  const [items, setItems] = createStore<any[]>([
    { id: Math.random(), description: "", quantity: 1, unitPrice: 0, taxRate: 16 }
  ]);

  const addItem = (e: MouseEvent) => {
    e.preventDefault();
    setItems([...items, { id: Math.random(), description: "", quantity: 1, unitPrice: 0, taxRate: 16 }]);
  };

  const removeItem = (id: number) => {
    if (items.length <= 1) return;
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const calculateSubtotal = () => items.reduce((acc, item) => acc + (item.quantity * (item.unitPrice || 0)), 0);
  const calculateTax = () => items.reduce((acc, item) => acc + (item.quantity * (item.unitPrice || 0) * (item.taxRate / 100)), 0);

  const handleSave = async () => {
    setErrorMessage(null);
    if (!selectedClientId()) return setErrorMessage("Please select a client before saving.");

    setIsSaving(true);
    try {
      const payload = {
        invoice: {
          clientId: Number(selectedClientId()),
          issueDate: new Date().toISOString(), 
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          currency: "KES",
          quotationRef: null 
        },
        items: items.map(i => ({ 
          description: String(i.description || "Service Item"),
          quantity: Number(i.quantity),
          unitPrice: String(i.unitPrice),
          taxRate: String(i.taxRate || "16"),
          taxType: "VAT",
          discountRate: "0",
          unitOfMeasurement: "pcs"
        }))
      };

      const res = await api.invoices.$post({ json: payload as any });
      
      if (res.ok) {
        navigate("/dashboard/invoices");
      } else {
        const errBody = (await res.json()) as any;
        setErrorMessage(errBody.error || "The server rejected the invoice data. Please check your inputs.");
      }
    } catch (err) {
      setErrorMessage("Network error: Could not reach the server. Please check your connection.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div class="p-6 max-w-6xl mx-auto space-y-6">
      <Show when={errorMessage()}>
        <Alert variant="destructive" class="border-red-200 bg-red-50 text-red-900 animate-in fade-in slide-in-from-top-4">
          <div class="flex items-start justify-between w-full">
            <div class="flex items-center gap-3">
              {AlertCircle({ class: "h-5 w-5 text-red-600" })}
              <div>
                <AlertTitle class="font-bold text-sm">Action Required</AlertTitle>
                <AlertDescription class="text-xs text-red-700">{errorMessage()}</AlertDescription>
              </div>
            </div>
            <button onClick={() => setErrorMessage(null)} class="p-1 hover:bg-red-100 rounded-full transition-colors">
              {X({ size: 16 })}
            </button>
          </div>
        </Alert>
      </Show>

      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)} disabled={isSaving()}>
                {ArrowLeft({ size: 18, class: "mr-2" })} Back
            </Button>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Generate Invoice</h1>
        </div>
        <Button onClick={handleSave} disabled={isSaving() || clientsData.loading} class="bg-slate-900 text-white hover:bg-black min-w-[160px] shadow-lg shadow-slate-200">
           <Show when={isSaving()} fallback={<>{Save({ size: 18, class: "mr-2" })} Save Invoice</>}>
              {Loader2({ class: "animate-spin mr-2", size: 18 })} Processing...
           </Show>
        </Button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-3 space-y-4">
          <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div class="p-4 border-b bg-slate-50/50 flex items-center gap-2 font-bold text-slate-700 text-xs uppercase tracking-widest">
                {FileText({ size: 16, class: "text-slate-400" })} Line Items
            </div>
            <table class="w-full text-sm">
              <thead class="bg-slate-50/30 text-slate-400 border-b border-slate-100 uppercase text-[10px] tracking-widest font-black">
                <tr>
                  <th class="p-4 text-left">Description</th>
                  <th class="p-4 w-24 text-center">Qty</th>
                  <th class="p-4 w-32 text-right">Unit Price</th>
                  <th class="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <For each={items}>
                  {(item, index) => (
                    <tr class="group hover:bg-slate-50/30 transition-colors">
                      <td class="p-2">
                        <Input 
                          placeholder="Service or Product Name..."
                          value={item.description} 
                          onInput={(e) => setItems(index(), "description", e.currentTarget.value)} 
                          class="border-transparent bg-transparent focus:bg-white focus:border-slate-200 transition-all" 
                        />
                      </td>
                      <td class="p-2">
                        <Input 
                          type="number" 
                          value={item.quantity} 
                          onInput={(e) => setItems(index(), "quantity", Number(e.currentTarget.value))} 
                          class="text-center border-transparent bg-transparent focus:bg-white" 
                        />
                      </td>
                      <td class="p-2">
                        <Input 
                          type="number" 
                          placeholder="0.00"
                          value={item.unitPrice || ""} 
                          onInput={(e) => setItems(index(), "unitPrice", Number(e.currentTarget.value))} 
                          class="text-right border-transparent bg-transparent focus:bg-white font-mono" 
                        />
                      </td>
                      <td class="p-2 text-center">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeItem(item.id)} 
                          class="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full" 
                          disabled={items.length <= 1}
                        >
                          {Trash2({ size: 16 })}
                        </Button>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
            <div class="p-4 bg-slate-50/30 border-t border-slate-100">
              <Button variant="outline" class="w-full border-dashed border-slate-300 text-slate-500 hover:text-slate-900" onClick={addItem}>
                {Plus({ size: 16, class: "mr-2" })} Add New Line Item
              </Button>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-white p-6 border border-slate-200 rounded-xl shadow-sm space-y-4">
            <label class="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 tracking-widest">
              {User({ size: 12 })} Client Details
            </label>
            <Select 
                options={clientsData() || []} 
                optionValue="id" 
                optionTextValue="name" 
                placeholder="Select Client"
                onChange={(val: any) => setSelectedClientId(val?.id ? Number(val.id) : null)}
                itemComponent={(props) => <SelectItem item={props.item}>{props.item.rawValue.name}</SelectItem>}
            >
                <SelectTrigger class="w-full border-slate-200 bg-slate-50/50">
                    <SelectValue<any>>{(state) => state.selectedOption()?.name ?? "Select Client"}</SelectValue>
                </SelectTrigger>
                <SelectContent />
            </Select>
            <div class="pt-4 border-t border-slate-100 flex items-center text-slate-500 text-[11px] font-medium uppercase tracking-tighter">
                {Calendar({ size: 14, class: "mr-2 text-slate-400" })} Date: {todayDate()}
            </div>
          </div>

          <div class="bg-slate-900 text-white p-6 rounded-xl shadow-xl space-y-4">
            <h3 class="text-[10px] font-black uppercase text-slate-500 border-b border-slate-800 pb-3 tracking-widest">Billing Summary</h3>
            
            <div class="space-y-2">
              <div class="flex justify-between text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                <span>Subtotal</span>
                <span class="font-mono text-white">KES {calculateSubtotal().toLocaleString()}</span>
              </div>
              <div class="flex justify-between text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                <span>Tax (16%)</span>
                <span class="font-mono text-white">KES {calculateTax().toLocaleString()}</span>
              </div>
            </div>

            <div class="flex justify-between items-baseline pt-4 border-t border-slate-800">
                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Grand Total</span>
                <div class="text-right">
                  <span class="text-2xl text-white font-black font-mono">
                    {(calculateSubtotal() + calculateTax()).toLocaleString()}
                  </span>
                  <p class="text-[9px] text-slate-500 font-bold uppercase">Incl. VAT</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}