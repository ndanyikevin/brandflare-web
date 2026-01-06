import { createSignal, createResource, For, Show } from "solid-js";
import { api } from "~/lib/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { 
  Plus, ClipboardList, Target, 
  Loader2, Layers, ChevronRight,
  Calendar, Activity, Coins
} from "lucide-solid";
import { 
  Sheet, SheetContent, SheetDescription, 
  SheetHeader, SheetTitle, SheetTrigger 
} from "~/components/ui/sheet";
import { Badge } from "~/components/ui/badge";

export default function TasksPage() {
  const [selectedWeekId, setSelectedWeekId] = createSignal<number | null>(null);
  const [isSaving, setIsSaving] = createSignal(false);
  const [isOpen, setIsOpen] = createSignal(false);

  // 1. Fetch Weeks for the dropdown
  const [weeks] = createResource(async () => {
    const res = await api.hr.weeks.$get();
    return res.ok ? await res.json() : [];
  });

  // 2. Fetch Tasks under the HR namespace
  const [tasks, { refetch }] = createResource(selectedWeekId, async (id) => {
    if (!id) return [];
    const res = await api.hr.tasks.$get({
      query: { weekId: String(id) }
    });
    return res.ok ? await res.json() : [];
  });

  // 3. Stats calculation
  const totalBudget = () => tasks()?.reduce((acc, t) => acc + Number(t.cost), 0) || 0;

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const weekId = selectedWeekId();
    if (!weekId) return;

    setIsSaving(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    
    const payload = {
      title: formData.get("title") as string,
      cost: Number(formData.get("cost")),
      weekId: weekId,
    };

    try {
      const res = await api.hr.tasks.$post({ json: payload });
      if (res.ok) {
        setIsOpen(false);
        refetch();
      }
    } catch (err) {
      console.error("Failed to save task", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div class="space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div class="p-2 bg-slate-900 rounded-xl text-white">
               <Layers size={24} />
            </div>
            Production Tasks
          </h1>
          <p class="text-slate-500 text-sm font-medium mt-1">Plan and budget jobs for the workshop floor</p>
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative flex-1 md:w-72">
            <Calendar class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              class="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 ring-slate-900/5 transition-all appearance-none"
              onChange={(e) => setSelectedWeekId(e.currentTarget.value ? Number(e.currentTarget.value) : null)}
            >
              <option value="">Choose Work Week...</option>
              <For each={weeks()}>
                {(week) => (
                  <option value={week.id}>
                    {new Date(week.startsOn).toLocaleDateString()} - {new Date(week.endsOn).toLocaleDateString()}
                  </option>
                )}
              </For>
            </select>
          </div>

          <Sheet open={isOpen()} onOpenChange={setIsOpen}>
            <SheetTrigger as={Button} class="bg-slate-900 rounded-xl h-[42px]" disabled={!selectedWeekId()}>
              <Plus size={18} class="mr-2" /> New Task
            </SheetTrigger>
            <SheetContent position="right" class="w-[400px]">
              <SheetHeader>
                <SheetTitle>Add Production Task</SheetTitle>
                <SheetDescription>Define the scope and labor budget for this job.</SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmit} class="space-y-6 mt-8">
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Job Title</label>
                  <Input name="title" placeholder="e.g. Varnishing Dining Tables" required class="rounded-xl" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Allocated Labor Budget (KES)</label>
                  <Input name="cost" type="number" placeholder="5000" required class="rounded-xl" />
                </div>
                <Button type="submit" class="w-full bg-slate-900 py-6 rounded-xl font-bold" disabled={isSaving()}>
                   <Show when={isSaving()} fallback="Create Task">
                      <Loader2 class="animate-spin mr-2" /> Saving Task...
                   </Show>
                </Button>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <Show when={selectedWeekId()}>
        {/* Quick Stats Bar */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div class="p-3 bg-blue-50 text-blue-600 rounded-xl"><Activity size={20}/></div>
            <div>
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Tasks</p>
               <p class="text-xl font-black text-slate-900">{tasks()?.length || 0}</p>
            </div>
          </div>
          <div class="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div class="p-3 bg-green-50 text-green-600 rounded-xl"><Coins size={20}/></div>
            <div>
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Labor Budget</p>
               <p class="text-xl font-black text-slate-900">KES {totalBudget().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Task Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <For each={tasks()} fallback={
            <div class="col-span-full h-64 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
               <ClipboardList size={40} strokeWidth={1} class="mb-2 opacity-30" />
               <p class="font-bold text-sm uppercase">No tasks created for this week</p>
            </div>
          }>
            {(task) => (
              <div class="bg-white border border-slate-200 rounded-[1.5rem] p-6 shadow-sm hover:border-slate-900 transition-all group flex flex-col">
                <div class="flex justify-between items-start mb-6">
                  <div class="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                    <ClipboardList size={22} />
                  </div>
                  <Badge variant="outline" class="font-mono py-1 px-3 border-slate-200 bg-slate-50 text-slate-600">
                    ID: {task.id}
                  </Badge>
                </div>
                
                <h3 class="font-black text-slate-900 text-lg leading-tight mb-2">{task.title}</h3>
                <div class="mt-auto pt-6">
                   <div class="flex justify-between items-end">
                      <div>
                         <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budgeted Cost</p>
                         <p class="text-xl font-black text-slate-900 font-mono leading-none">
                            <span class="text-xs font-normal text-slate-400 mr-1">KES</span>
                            {Number(task.cost).toLocaleString()}
                         </p>
                      </div>
                      <Button variant="ghost" size="sm" class="rounded-lg hover:bg-slate-100 group-hover:text-slate-900">
                         <ChevronRight size={18} />
                      </Button>
                   </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      <Show when={!selectedWeekId()}>
        <div class="h-96 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 bg-slate-50/20">
           <Layers size={64} strokeWidth={1} class="mb-4 opacity-20" />
           <p class="text-lg font-bold text-slate-400">Select a Production Week</p>
           <p class="text-sm text-slate-400">You must select a work week to manage its specific tasks.</p>
        </div>
      </Show>
    </div>
  );
}