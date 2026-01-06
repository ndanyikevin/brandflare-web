import { createSignal, createResource, For, Show, createMemo } from "solid-js";
import { api } from "~/lib/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { 
  Plus, Search, Phone, 
  CreditCard, MoreVertical, Loader2, Users 
} from "lucide-solid";
import { 
  Sheet, SheetContent, SheetDescription, 
  SheetHeader, SheetTitle, SheetTrigger 
} from "~/components/ui/sheet";
import { Badge } from "~/components/ui/badge";

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = createSignal("");
  const [isSaving, setIsSaving] = createSignal(false);
  const [isOpen, setIsOpen] = createSignal(false);

  // 1. Fetch Employees Resource
  const [employees, { refetch }] = createResource(async () => {
    try {
      const res = await api.hr.employees.$get();
      return res.ok ? await res.json() : [];
    } catch (e) {
      console.error("HR API Error:", e);
      return [];
    }
  });

  // 2. Performance-optimized Filter
  const filteredEmployees = createMemo(() => {
    const query = searchQuery().toLowerCase().trim();
    const list = employees() || [];
    if (!query) return list;
    
    return list.filter(emp => 
      emp.name.toLowerCase().includes(query) || 
      emp.nationalId.includes(query)
    );
  });

  // 3. Form Submission
  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const payload = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      nationalId: formData.get("nationalId") as string,
    };

    try {
      const res = await api.hr.employees.$post({ json: payload as any });
      if (res.ok) {
        setIsOpen(false);
        refetch(); 
      } else {
        alert("Failed to register employee. Check if National ID is unique.");
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div class="space-y-6 max-w-7xl mx-auto p-4 md:p-0">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight uppercase italic flex items-center gap-3">
            {Users({ size: 28, class: "text-slate-400" })} Workforce Registry
          </h1>
          <p class="text-slate-500 text-sm font-medium">Manage production staff profiles and deployment status</p>
        </div>

        <Sheet open={isOpen()} onOpenChange={setIsOpen}>
          <SheetTrigger 
            as={Button} 
            class="bg-slate-900 hover:bg-black text-white rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95"
          >
            {Plus({ size: 18, class: "mr-2" })} Register Employee
          </SheetTrigger>
          <SheetContent class="w-[400px] border-l-slate-100 shadow-2xl">
            <SheetHeader class="space-y-1">
              <SheetTitle class="text-xl font-black uppercase italic">New Employee</SheetTitle>
              <SheetDescription class="font-medium text-slate-500">
                Onboard a new worker to the workforce directory.
              </SheetDescription>
            </SheetHeader>
            
            <form onSubmit={handleSubmit} class="space-y-6 mt-10">
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Official Name</label>
                <Input 
                  name="name" 
                  placeholder="e.g. Samuel Okoth" 
                  required 
                  class="bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
                />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                <Input 
                  name="phone" 
                  placeholder="07XXXXXXXX" 
                  required 
                  class="bg-slate-50 border-slate-200 focus:bg-white h-11"
                />
              </div>
              <div class="space-y-2">
                <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">National ID / Passport</label>
                <Input 
                  name="nationalId" 
                  placeholder="Enter ID Number" 
                  required 
                  class="bg-slate-50 border-slate-200 focus:bg-white h-11"
                />
              </div>
              <Button type="submit" class="w-full bg-slate-900 h-12 rounded-xl font-bold uppercase tracking-widest" disabled={isSaving()}>
                <Show when={isSaving()} fallback="Initialize Profile">
                  {Loader2({ class: "animate-spin mr-2", size: 18 })} Processing...
                </Show>
              </Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Directory Controls */}
      <div class="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div class="relative flex-1 w-full">
          {Search({ size: 16, class: "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" })}
          <input 
            type="text" 
            placeholder="Search by name or national ID..." 
            class="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:ring-4 ring-slate-100 rounded-xl text-sm transition-all outline-none border border-slate-100 focus:border-slate-300 font-medium"
            onInput={(e) => setSearchQuery(e.currentTarget.value)}
          />
        </div>
        <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
          {filteredEmployees().length} Active Staff Members
        </div>
      </div>

      {/* Employee List */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <For each={filteredEmployees()} fallback={
          <div class="col-span-full py-24 text-center border-2 border-dashed border-slate-100 rounded-3xl">
            <div class="flex justify-center mb-4 opacity-10">
              {Users({ size: 64 })}
            </div>
            <p class="text-slate-400 font-medium italic">No personnel found matching your search criteria.</p>
          </div>
        }>
          {(emp) => (
            <div class="bg-white border border-slate-200 rounded-3xl p-6 hover:border-slate-900 hover:shadow-xl hover:shadow-slate-100 transition-all group relative overflow-hidden">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-4">
                  <div class="h-14 w-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-slate-200">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <h3 class="font-black text-slate-900 text-lg leading-tight">{emp.name}</h3>
                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                      {CreditCard({ size: 11 })} {emp.nationalId}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" class="h-8 w-8 text-slate-300 hover:text-slate-900 rounded-full">
                  {MoreVertical({ size: 18 })}
                </Button>
              </div>

              <div class="mt-8 pt-5 border-t border-slate-50 flex items-center justify-between">
                <div class="flex items-center gap-2 text-slate-600 font-bold text-xs">
                  {Phone({ size: 14, class: "text-slate-300" })}
                  {emp.phone}
                </div>
                <Badge variant="outline" class="bg-emerald-50 text-emerald-700 border-emerald-100 font-black text-[9px] uppercase tracking-tighter px-3">
                  Production
                </Badge>
              </div>
              
              {/* Subtle background element */}
              <div class="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                {Users({ size: 100 })}
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}