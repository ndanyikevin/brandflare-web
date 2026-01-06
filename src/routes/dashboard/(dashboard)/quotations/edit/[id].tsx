import { useParams, useNavigate } from "@solidjs/router";
import { createResource, Show, createSignal, For, onMount } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { api, apiFetch } from "~/lib/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { 
  Trash2, Plus, Save, 
  ArrowLeft, Loader2, AlertCircle, 
  CheckCircle2 
} from "lucide-solid";
import { Quotation } from "~/services/quotation.service";

export default function EditQuotationPage() {
    const params = useParams();
    const navigate = useNavigate();
    
    // UI States
    const [isSaving, setIsSaving] = createSignal(false);
    const [errorMessage, setErrorMessage] = createSignal<string | null>(null);
    const [successMessage, setSuccessMessage] = createSignal<string | null>(null);

    const [items, setItems] = createStore<any[]>([]);

    const [quotation] = createResource(() => params.id, async (id) => {
        const data = await apiFetch<Quotation>(`/quotations/${id}`);
        if (data?.items) {
            // We use reconcile to update the store once data arrives
            setItems(reconcile(data.items));
        }
        return data;
    });

    const addItem = () => {
        setItems(items.length, { 
            description: "", quantity: 1, unitPrice: 0, 
            taxRate: 0, discountRate: 0, unitOfMeasurement: "pcs" 
        });
    };

    const handleSave = async (e: Event) => {
        e.preventDefault();
        if (!params.id || isSaving()) return;

        setErrorMessage(null);
        setSuccessMessage(null);
        setIsSaving(true);

        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const payload = {
            clientId: Number(formData.get("clientId")),
            status: formData.get("status"),
            items: items.map(item => ({
                description: item.description,
                quantity: Number(item.quantity),
                unitPrice: Number(item.unitPrice),
                taxRate: Number(item.taxRate || 0),
                discountRate: Number(item.discountRate || 0),
                unitOfMeasurement: item.unitOfMeasurement || "pcs"
            }))
        };

        try {
            const res = await (api.quotations as any)[":id"].$put({
                param: { id: params.id },
                json: payload
            });

            if (res.ok) {
                setSuccessMessage("Quotation updated successfully! Redirecting...");
                setTimeout(() => navigate(`/dashboard/quotations/${params.id}`), 1500);
            } else {
                const errorData = await res.json();
                setErrorMessage(errorData.message || "Failed to save. Please check your inputs.");
                setIsSaving(false);
            }
        } catch (err) {
            setErrorMessage("Network error. Please try again.");
            setIsSaving(false);
        }
    };

    return (
        <div class="p-6 max-w-4xl mx-auto space-y-6">
            <Show 
                when={!quotation.loading} 
                fallback={<div class="p-20 text-center animate-pulse text-slate-400 font-medium">Loading Quotation Data...</div>}
            >
                
                {/* Status Messages - Using Function-Style Icons */}
                <Show when={errorMessage()}>
                    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                        {AlertCircle({ size: 18 })} 
                        <span>{errorMessage()}</span>
                    </div>
                </Show>

                <Show when={successMessage()}>
                    <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                        {CheckCircle2({ size: 18 })} 
                        <span>{successMessage()}</span>
                    </div>
                </Show>

                <form onSubmit={handleSave} class="space-y-6">
                    <div class="flex justify-between items-center">
                        <Button type="button" variant="ghost" onClick={() => navigate(-1)} disabled={isSaving()}>
                            {ArrowLeft({ size: 18, class: "mr-2" })} Back
                        </Button>
                        <h1 class="text-2xl font-bold">Edit Quotation</h1>
                        <Button type="submit" disabled={isSaving()} class="w-32">
                            <Show when={isSaving()} fallback="Save Changes">
                                {Loader2({ size: 18, class: "animate-spin" })}
                            </Show>
                        </Button>
                    </div>

                    <div class="bg-white p-6 rounded-xl border shadow-sm grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label class="text-sm font-medium">Client ID</label>
                            <Input name="clientId" value={quotation()?.clientId} type="number" required />
                        </div>
                        <div class="space-y-1">
                            <label class="text-sm font-medium">Status</label>
                            <select name="status" class="w-full h-10 px-3 rounded-md border border-input bg-white">
                                <For each={["draft", "sent", "accepted", "rejected"]}>
                                    {(s) => (
                                        <option value={s} selected={quotation()?.status === s}>
                                            {s.charAt(0).toUpperCase() + s.slice(1)}
                                        </option>
                                    )}
                                </For>
                            </select>
                        </div>
                    </div>

                    <div class="space-y-4">
                        <h3 class="font-semibold">Line Items</h3>
                        <div class="border rounded-lg overflow-hidden bg-white">
                            <table class="w-full text-sm">
                                <thead class="bg-slate-50">
                                    <tr class="border-b">
                                        <th class="p-3 text-left font-semibold">Description</th>
                                        <th class="p-3 w-24 font-semibold text-center">Qty</th>
                                        <th class="p-3 w-32 font-semibold text-center">Price</th>
                                        <th class="w-12"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <For each={items}>
                                        {(item, index) => (
                                            <tr class="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                                                <td class="p-2">
                                                    <Input 
                                                        value={item.description} 
                                                        onInput={e => setItems(index(), "description", e.currentTarget.value)} 
                                                        placeholder="Item description..."
                                                    />
                                                </td>
                                                <td class="p-2">
                                                    <Input 
                                                        type="number" 
                                                        value={item.quantity || ""} 
                                                        onInput={e => setItems(index(), "quantity", Number(e.currentTarget.value))} 
                                                        class="text-center"
                                                    />
                                                </td>
                                                <td class="p-2">
                                                    <Input 
                                                        type="number" 
                                                        value={item.unitPrice || ""} 
                                                        onInput={e => setItems(index(), "unitPrice", Number(e.currentTarget.value))} 
                                                        class="text-right"
                                                    />
                                                </td>
                                                <td class="p-2 text-center">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={() => setItems(items.filter((_, i) => i !== index()))}
                                                    >
                                                        {Trash2({ size: 14, class: "text-red-500" })}
                                                    </Button>
                                                </td>
                                            </tr>
                                        )}
                                    </For>
                                </tbody>
                            </table>
                        </div>
                        <Button type="button" variant="outline" class="w-full border-dashed" onClick={addItem}>
                            {Plus({ size: 16, class: "mr-2" })} Add Item
                        </Button>
                    </div>
                </form>
            </Show>
        </div>
    );
}