import { createResource, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { api } from "~/lib/api";
import { 
  ChevronLeft, Mail, Phone, MapPin, 
  Pencil, Trash2, Globe, FilePlus, 
  History, Wallet, User 
} from "lucide-solid";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export default function ViewClientPage() {
  const params = useParams();
  const navigate = useNavigate();

  const [client] = createResource(
    () => params.id,
    async (id) => {
      // ✅ Ensure id is a string to satisfy the API types
      const res = await api.clients[":id"].$get({ param: { id: id || "" } });
      return res.ok ? await res.json() : null;
    }
  );

  const handleDelete = async () => {
    if (!confirm("Are you sure? This will remove the client and archive their history.")) return;
    const res = await api.clients[":id"].$delete({ param: { id: params.id || "" } });
    if (res.ok) navigate("/dashboard/clients");
  };

  return (
    <div class="flex-1 space-y-6 p-8 pt-6 max-w-7xl mx-auto">
      {/* Action Bar */}
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/dashboard/clients")}
            class="group text-slate-500 hover:text-slate-900"
          >
            {ChevronLeft({ class: "mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" })}
            Back to Directory
          </Button>
          <h2 class="text-3xl font-black tracking-tight text-slate-900 uppercase italic">Client Profile</h2>
        </div>
        <div class="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/clients/${params.id}/edit`)}>
            {Pencil({ class: "mr-2 h-4 w-4" })}
            Edit Profile
          </Button>
          <Button size="sm" class="bg-slate-900 text-white" onClick={() => navigate('/dashboard/invoices/new')}>
            {FilePlus({ class: "mr-2 h-4 w-4" })}
            Create Invoice
          </Button>
        </div>
      </div>

      <Separator />

      <Show when={client()} fallback={
        <div class="flex h-96 flex-col items-center justify-center text-slate-400 border-2 border-dashed rounded-3xl animate-pulse">
          {User({ size: 48, class: "mb-4 opacity-20" })}
          <p class="font-medium">Fetching client profile...</p>
        </div>
      }>
        {(data) => (
          <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            
            {/* Main Info Card */}
            <Card class="col-span-4 rounded-3xl border-slate-200 shadow-sm overflow-hidden">
              <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-6 bg-slate-50/50">
                <div class="space-y-1">
                  <div class="flex items-center gap-3">
                    {/* ✅ FIX: Call data() as a function */}
                    <CardTitle class="text-3xl font-black text-slate-900">{data().name}</CardTitle>
                    <Badge variant="outline" class="font-mono text-[10px] uppercase">ID-{data().id}</Badge>
                  </div>
                  <CardDescription class="font-medium">
                    Profile status: Active
                  </CardDescription>
                </div>
                <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-200">
                  {User({ size: 32 })}
                </div>
              </CardHeader>
              <CardContent class="pt-6">
                <div class="grid grid-cols-2 gap-8">
                  <div class="space-y-2">
                    <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      {Mail({ size: 12 })} Email Address
                    </p>
                    <p class="text-sm font-bold text-slate-700">{data().email || "No email provided"}</p>
                  </div>
                  <div class="space-y-2">
                    <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      {Phone({ size: 12 })} Contact Number
                    </p>
                    <p class="text-sm font-bold text-slate-700">{data().phone || "No phone provided"}</p>
                  </div>
                </div>
                
                <Separator class="my-8" />
                
                <div class="space-y-6">
                  <h4 class="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-slate-900">
                    {MapPin({ class: "h-4 w-4 text-slate-400" })}
                    Billing & Shipping Logistics
                  </h4>
                  <div class="grid grid-cols-2 gap-6 rounded-2xl border border-slate-100 p-6 bg-slate-50/30">
                    <div class="space-y-1">
                      <p class="text-[9px] font-black uppercase text-slate-400">Postal Details</p>
                      <p class="text-sm font-bold text-slate-700">
                        {data().poBox ? `P.O. Box ${data().poBox}` : "No P.O. Box"}
                      </p>
                      <p class="text-xs text-slate-500">{data().postalCode || "No Zip"}</p>
                    </div>
                    <div class="space-y-1">
                      <p class="text-[9px] font-black uppercase text-slate-400">Location</p>
                      <p class="text-sm font-bold text-slate-700">{data().city}</p>
                      <p class="text-xs font-bold text-slate-500 flex items-center gap-1 uppercase tracking-tighter">
                        {Globe({ size: 12, class: "text-slate-400" })} {data().country || "Kenya"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Sidebar */}
            <div class="col-span-3 space-y-6">
              <Card class="rounded-3xl border-slate-200 shadow-sm">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-xs font-black uppercase tracking-widest text-slate-500">Revenue Contribution</CardTitle>
                  {Wallet({ class: "h-4 w-4 text-emerald-500" })}
                </CardHeader>
                <CardContent>
                  <div class="text-3xl font-black text-slate-900 font-mono tracking-tighter">KES 0.00</div>
                  <p class="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                    From 0 finalized invoices
                  </p>
                </CardContent>
              </Card>

              <Card class="rounded-3xl border-slate-200 shadow-sm">
                <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle class="text-xs font-black uppercase tracking-widest text-slate-500">Active Pipeline</CardTitle>
                  {History({ class: "h-4 w-4 text-blue-500" })}
                </CardHeader>
                <CardContent>
                  <div class="text-3xl font-black text-slate-900 font-mono tracking-tighter">0</div>
                  <Button variant="link" class="h-auto p-0 text-xs font-bold text-blue-600 uppercase tracking-tight" onClick={() => navigate('/dashboard/invoices')}>
                    View full history →
                  </Button>
                </CardContent>
              </Card>

              <Card class="rounded-3xl border-red-100 bg-red-50/30">
                <CardHeader>
                  <CardTitle class="text-xs text-red-600 font-black uppercase tracking-widest flex items-center gap-2">
                    System Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p class="text-[11px] font-medium text-slate-500 mb-4 leading-relaxed">
                    Deleting this client will restrict new transactions. Historical data will be preserved for tax compliance.
                  </p>
                  <Button variant="destructive" size="sm" class="w-full rounded-xl font-bold uppercase text-[10px] tracking-widest" onClick={handleDelete}>
                    {Trash2({ class: "mr-2 h-4 w-4" })} Delete Client
                  </Button>
                </CardContent>
              </Card>
            </div>

          </div>
        )}
      </Show>
    </div>
  );
}