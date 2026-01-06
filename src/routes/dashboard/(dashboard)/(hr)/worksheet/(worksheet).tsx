import { createSignal, createResource, For, Show, Suspense, ErrorBoundary, createMemo } from "solid-js";
import { api } from "~/lib/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { 
  Calendar, 
  Users, 
  Loader2, 
  Plus, 
  LayoutGrid, 
  Gift, 
  AlertTriangle,
  ChevronRight,
  TrendingDown
} from "lucide-solid";
import { 
  Sheet, SheetContent, SheetDescription, 
  SheetHeader, SheetTitle, SheetTrigger 
} from "~/components/ui/sheet";

export default function WeeklyWorksheetPage() {
  const [selectedWeekId, setSelectedWeekId] = createSignal<number | null>(null);
  const [activeTaskId, setActiveTaskId] = createSignal<number | null>(null);
  const [isSaving, setIsSaving] = createSignal(false);

  // 1. Resources
  const [weeks] = createResource(async () => {
    try {
      const res = await api.hr.weeks.$get();
      return res.ok ? await res.json() : [];
    } catch (e) {
      console.error("Fetch Weeks Error:", e);
      return [];
    }
  });

  const [employees] = createResource(async () => {
    try {
      const res = await api.hr.employees.$get();
      return res.ok ? await res.json() : [];
    } catch (e) {
      return [];
    }
  });

  const [tasks] = createResource(selectedWeekId, async (id) => {
    if (!id) return [];
    const res = await api.hr.tasks.$get({ query: { weekId: String(id) } });
    return res.ok ? await res.json() : [];
  });

  const [weekAssignments, { refetch: refetchAssignments }] = createResource(selectedWeekId, async (id) => {
    if (!id) return [];
    const res = await (api.hr.weeks as any)[":id"].payroll.$get({
      param: { id: String(id) }
    });
    return res.ok ? await res.json() : [];
  });

  // 2. Logic: Memoized Data Merging
  const groupedByTask = createMemo(() => {
    const t = tasks();
    const a = weekAssignments();
    if (!t) return [];

    return t.map(task => ({
      task,
      assignments: Array.isArray(a) ? a.filter(item => item.taskId === task.id) : []
    }));
  });

  // 3. Handlers
  const handleAssignWorker = async (e: SubmitEvent) => {
    e.preventDefault();
    const taskId = activeTaskId();
    if (!taskId) return;

    setIsSaving(true);
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    try {
      const res = await api.hr.assignments.$post({
        json: {
          taskId: taskId,
          employeeId: Number(fd.get("employeeId")),
          basePay: Number(fd.get("basePay")),
          allowance: Number(fd.get("allowance") || 0),
          deduction: Number(fd.get("deduction") || 0),
        }
      });

      if (res.ok) {
        await refetchAssignments();
        setActiveTaskId(null);
      }
    } catch (err) {
        console.error("Assignment error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ErrorBoundary fallback={(err) => (
      <div class="h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-white rounded-[3rem] border-2 border-dashed border-red-100 mt-10">
        <div class="p-4 bg-red-50 rounded-full mb-6">
            <AlertTriangle size={48} class="text-red-500" />
        </div>
        <h2 class="text-2xl font-black text-slate-900 uppercase italic">System Interrupted</h2>
        <p class="text-slate-500 max-w-xs mx-auto text-sm mt-2 font-medium italic">{err.message}</p>
        <Button class="mt-8 bg-slate-900 h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-xs" onClick={() => window.location.reload()}>
            Re-initialize App
        </Button>
      </div>
    )}>
      <Suspense fallback={
        <div class="h-[80vh] w-full flex flex-col items-center justify-center gap-4">
          <Loader2 class="animate-spin text-slate-200" size={48} strokeWidth={1} />
          <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Workforce Data...</p>
        </div>
      }>
        <div class="max-w-7xl mx-auto space-y-8 p-4 md:p-0">
          
          {/* HEADER SECTION */}
          <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div class="space-y-1">
              <h1 class="text-3xl font-black text-slate-900 tracking-tight uppercase italic flex items-center gap-3">
                <div class="p-2 bg-slate-900 rounded-xl text-white shadow-lg shadow-slate-200">
                    <LayoutGrid size={24} /> 
                </div>
                Worksheet
              </h1>
              <p class="text-slate-400 text-sm font-medium italic">Operational dispatch & labor allocation</p>
            </div>

            <div class="relative w-full lg:w-80">
              <Calendar class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <select 
                class="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-6 py-3.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 ring-slate-900/5 transition-all appearance-none cursor-pointer"
                onChange={(e) => setSelectedWeekId(e.currentTarget.value ? Number(e.currentTarget.value) : null)}
              >
                <option value="">Select Target Week...</option>
                <For each={weeks()}>
                  {(week) => (
                    <option value={week.id}>
                      {new Date(week.startsOn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} — {new Date(week.endsOn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </option>
                  )}
                </For>
              </select>
            </div>
          </div>

          <Show when={!selectedWeekId()}>
            <div class="h-96 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 bg-slate-50/20 text-center px-6">
              <div class="mb-6 opacity-10">
                <Calendar size={80} strokeWidth={1} />
              </div>
              <p class="font-black text-slate-400 uppercase tracking-widest text-xs">Waiting for Period Selection</p>
              <p class="text-[11px] text-slate-400 font-medium italic mt-2">Select a production week to begin assigning personnel to active tasks.</p>
            </div>
          </Show>

          {/* TASKS & ASSIGNMENTS GRID */}
          <Show when={selectedWeekId()}>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <For each={groupedByTask()}>
                {(group) => (
                  <div class="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all group">
                    <div class="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
                          <Users size={20} />
                        </div>
                        <div>
                          <h3 class="font-black text-slate-900 text-sm uppercase leading-tight tracking-tight">{group.task.title}</h3>
                          <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                            Budget: <span class="text-slate-900 font-mono">KES {Number(group.task.cost).toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                      
                      <Sheet open={activeTaskId() === group.task.id} onOpenChange={(open) => setActiveTaskId(open ? group.task.id : null)}>
                        <SheetTrigger as={Button} size="sm" class="rounded-xl w-10 h-10 p-0 bg-white border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                          <Plus size={18} />
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle class="text-2xl font-black uppercase italic">Personnel Dispatch</SheetTitle>
                            <SheetDescription class="font-medium">Assigning staff to: <span class="text-slate-900 font-bold">{group.task.title}</span></SheetDescription>
                          </SheetHeader>
                          <form onSubmit={handleAssignWorker} class="space-y-6 mt-10">
                            <div class="space-y-2">
                              <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Select Staff Member</label>
                              <select name="employeeId" class="w-full h-12 px-4 bg-slate-50 border rounded-xl font-bold text-sm outline-none focus:ring-4 ring-slate-900/5 appearance-none" required>
                                <option value="">Select Personnel...</option>
                                <For each={employees()}>{(emp) => <option value={emp.id}>{emp.name}</option>}</For>
                              </select>
                            </div>
                            
                            <div class="space-y-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                              <div class="space-y-2">
                                <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Negotiated Base Pay (KES)</label>
                                <Input name="basePay" type="number" required class="h-12 rounded-xl border-slate-200 font-mono font-bold" />
                              </div>
                              <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                  <label class="text-[10px] font-black uppercase text-emerald-600 flex items-center gap-1 tracking-widest">
                                    <Gift size={10}/> Allowance
                                  </label>
                                  <Input name="allowance" type="number" value="0" class="h-12 rounded-xl border-slate-200 font-mono text-emerald-600" />
                                </div>
                                <div class="space-y-2">
                                  <label class="text-[10px] font-black uppercase text-red-500 tracking-widest flex items-center gap-1">
                                    <TrendingDown size={10} /> Deduction
                                  </label>
                                  <Input name="deduction" type="number" value="0" class="h-12 rounded-xl border-slate-200 font-mono text-red-500" />
                                </div>
                              </div>
                            </div>

                            <Button type="submit" class="w-full bg-slate-900 h-14 rounded-xl font-black uppercase tracking-widest text-xs" disabled={isSaving()}>
                               {isSaving() ? <Loader2 class="animate-spin" /> : "Authorize Assignment"}
                            </Button>
                          </form>
                        </SheetContent>
                      </Sheet>
                    </div>

                    <div class="p-6 space-y-3 min-h-[160px] bg-white">
                      <For each={group.assignments} fallback={
                        <div class="h-24 flex flex-col items-center justify-center opacity-20 gap-2">
                            <Users size={32} strokeWidth={1} />
                            <p class="text-[9px] font-black uppercase tracking-[0.2em]">Unstaffed Task</p>
                        </div>
                      }>
                        {(assignment) => (
                          <div class="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-white transition-all group/item">
                            <div class="flex items-center gap-4">
                              <div class="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-900 uppercase shadow-sm group-hover/item:bg-slate-900 group-hover/item:text-white transition-all">
                                {assignment.employee?.name.charAt(0)}
                              </div>
                              <div>
                                <p class="text-sm font-black text-slate-900 tracking-tight leading-none mb-1.5">{assignment.employee?.name}</p>
                                <div class="flex gap-3 text-[9px] font-black uppercase tracking-tighter">
                                  <span class="text-slate-400">Base: {assignment.basePay}</span>
                                  <Show when={Number(assignment.allowance) > 0}>
                                    <span class="text-emerald-500">+{assignment.allowance}</span>
                                  </Show>
                                  <Show when={Number(assignment.deduction) > 0}>
                                    <span class="text-red-500">-{assignment.deduction}</span>
                                  </Show>
                                </div>
                              </div>
                            </div>
                            <div class="text-right">
                                <p class="text-sm font-black text-slate-900 font-mono tracking-tighter">
                                    {(Number(assignment.basePay) + Number(assignment.allowance) - Number(assignment.deduction)).toLocaleString()}
                                </p>
                                <p class="text-[8px] font-black uppercase text-slate-300 tracking-widest">Payable</p>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>

                    <div class="mt-auto p-5 bg-slate-900 text-white flex justify-between items-center px-8">
                      <div class="flex flex-col">
                        <span class="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Section Liability</span>
                        <span class="text-lg font-black font-mono tracking-tighter">
                          <span class="text-[10px] font-normal opacity-40 mr-1 italic">KES</span>
                          {group.assignments.reduce((sum: number, a: any) => 
                            sum + (Number(a.basePay) + Number(a.allowance) - Number(a.deduction)), 0
                          ).toLocaleString()}
                        </span>
                      </div>
                      <ChevronRight size={20} class="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}