import { useNavigate } from "@solidjs/router";
import { createSignal, For, Show, createResource, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import { api } from "~/lib/api"; 
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { 
  Trash2, Plus, Save, 
  ArrowLeft, Loader2, Calendar, 
  User, FileText 
} from "lucide-solid";

export default function CreateQuotationPage() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = createSignal(false);
  const [selectedClientId, setSelectedClientId] = createSignal<number | null>(null);

  // ✅ Memoize today's date so it's stable during the hydration phase
  const today = createMemo(() => new Date().toISOString().split('T')[0]);

  // 1. Fetch clients for the dropdown
  const [clientsData] = createResource(async () => {
    const res = await api.clients.search.$get();
    if (res.ok) return await res.json();
    return [];
  });

  // 2. Manage line items via Store for stable focus
  const [items, setItems] = createStore<any[]>([
    { description: "", quantity: 1, unitPrice: 0, taxRate: 0, discountRate: 0 }
  ]);

  const addItem = (e: MouseEvent) => {
    e.preventDefault(); 
    setItems(items.length, { 
        description: "", 
        quantity: 1, 
        unitPrice: 0, 
        taxRate: 0, 
        discountRate: 0 
    });
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) {
        setItems(0, { description: "", quantity: 1, unitPrice: 0, taxRate: 0, discountRate: 0 });
        return;
    }
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!selectedClientId()) return alert("Please select a client");
    
    setIsSaving(true);
    try {
      const res = await api.quotations.$post({
        json: {
          clientId: selectedClientId()!,
          issueDate: new Date().toISOString(),
          items: items.map(i => ({ 
            ...i, 
            unitPrice: Number(i.unitPrice),
            quantity: Number(i.quantity),
            unitOfMeasurement: "pcs" 
          })),
          status: "draft"
        }
      });
      if (res.ok) navigate("/dashboard/quotations");
    } catch (err) {
        console.error("Save failed", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div class="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
            <Button variant="ghost" type="button" onClick={() => navigate(-1)}>
                {ArrowLeft({ size: 20, class: "mr-2" })} Back
            </Button>
            <h1 class="text-2xl font-bold text-slate-900">Create Quotation</h1>
        </div>
        <Button onClick={handleSubmit} disabled={isSaving() || clientsData.loading} class="min-w-[150px]">
           <Show when={isSaving()} fallback={Save({ size: 18, class: "mr-2" })}>
              {Loader2({ size: 18, class: "animate-spin mr-2" })}
           </Show>
           {isSaving() ? "Saving..." : "Save Quotation"}
        </Button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content: Items Table */}
        <div class="lg:col-span-3 space-y-4">
          <div class="bg-white border rounded-xl shadow-sm overflow-hidden">
            <div class="p-4 border-b bg-slate-50/50 flex items-center gap-2">
                {FileText({ size: 18, class: "text-slate-500" })}
                <h2 class="font-semibold text-slate-700">Line Items</h2>
            </div>
            <table class="w-full text-sm">
              <thead class="bg-slate-50/30 text-slate-500 border-b text-[11px] uppercase tracking-wider font-bold">
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
                    <tr class="group hover:bg-slate-50/30">
                      <td class="p-2">
                        <Input 
                          placeholder="Item description (e.g. Oak Office Desk)..." 
                          value={item.description} 
                          onInput={(e) => setItems(index(), "description", e.currentTarget.value)}
                          class="border-slate-200 px-3 h-9" 
                        />
                      </td>
                      <td class="p-2">
                        <Input 
                          type="number" 
                          value={item.quantity} 
                          onInput={(e) => setItems(index(), "quantity", Number(e.currentTarget.value))}
                          class="h-9 text-center px-2"
                        />
                      </td>
                      <td class="p-2">
                        <Input 
                          type="number" 
                          value={item.unitPrice === 0 ? "" : item.unitPrice} 
                          onInput={(e) => setItems(index(), "unitPrice", Number(e.currentTarget.value))}
                          class="h-9 text-right px-3"
                        />
                      </td>
                      <td class="p-2 text-center">
                        <Button 
                          variant="ghost" 
                          type="button"
                          size="icon" 
                          onClick={() => removeItem(index())}
                          class="text-slate-400 hover:text-red-500"
                        >
                          {Trash2({ size: 16 })}
                        </Button>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
            <div class="p-4 bg-slate-50/30 border-t">
              <Button type="button" variant="outline" class="w-full border-dashed" onClick={addItem}>
                {Plus({ size: 16, class: "mr-2" })} Add New Item
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar: Client & Totals */}
        <div class="space-y-4">
          <div class="bg-white p-6 border rounded-xl shadow-sm space-y-4">
            <div class="space-y-2">
                <label class="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1 tracking-widest">
                    {User({ size: 12 })} Client Selection
                </label>
                <Select
                    options={clientsData() || []}
                    optionValue="id"
                    optionTextValue="name"
                    placeholder="Search for a client..."
                    onChange={(c) => setSelectedClientId(c?.id ?? null)}
                    itemComponent={(props) => (
                        <SelectItem item={props.item}>
                            {props.item.rawValue.name}
                        </SelectItem>
                    )}
                >
                    <SelectTrigger class="w-full px-3 bg-white">
                        <SelectValue<any>>
                            {(state) => state.selectedOption()?.name ?? "Select Client"}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectContent />
                </Select>
            </div>

            <div class="space-y-2 pt-2">
                <label class="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1 tracking-widest">
                    {Calendar({ size: 12 })} Issue Date
                </label>
                <Input type="date" value={today()} class="px-3" />
            </div>
          </div>

          <div class="bg-slate-900 text-white p-6 rounded-xl shadow-lg space-y-4">
            <h3 class="text-[10px] font-bold uppercase text-slate-500 tracking-widest border-b border-slate-800 pb-3">Summary</h3>
            <div class="flex justify-between text-sm">
                <span class="text-slate-400">Subtotal</span>
                <span class="font-mono">KES {calculateSubtotal().toLocaleString()}</span>
            </div>
            <div class="pt-4 border-t border-slate-800 flex justify-between items-center">
              <span class="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Total</span>
              <span class="text-2xl font-black text-white">
                {calculateSubtotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}