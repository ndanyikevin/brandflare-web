import { createSignal, createResource, For, Show, createMemo } from "solid-js";
import { api } from "~/lib/api";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { 
  FileSpreadsheet, 
  Printer, 
  Wallet, 
  BadgeCheck,
  Plus,
  Calendar,
  Loader2
} from "lucide-solid";
import { Badge } from "~/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export default function PayrollPage() {
  const [selectedWeekId, setSelectedWeekId] = createSignal<number | null>(null);
  const [isAddingWeek, setIsAddingWeek] = createSignal(false);
  const [isWeekSheetOpen, setIsWeekSheetOpen] = createSignal(false);

  // 1. Fetch Weeks
  const [weeks, { refetch: refetchWeeks }] = createResource(async () => {
    const res = await api.hr.weeks.$get();
    return res.ok ? await res.json() : [];
  });

  // 2. Fetch Weekly Payroll
  const [rawPayroll] = createResource(selectedWeekId, async (id) => {
    if (!id) return [];
    const res = await (api.hr.weeks as any)[":id"].payroll.$get({
      param: { id: String(id) }
    });
    return res.ok ? await res.json() : [];
  });

  // 3. Aggregate Calculations
  const employeeSummaries = createMemo(() => {
    const data = rawPayroll();
    if (!data || !Array.isArray(data)) return [];
    const summaryMap = new Map();

    data.forEach(item => {
      const empId = item.employeeId;
      const current = summaryMap.get(empId) || {
        name: item.employee.name,
        phone: item.employee.phone,
        totalBase: 0,
        totalAllowance: 0,
        totalDeduction: 0,
        taskCount: 0
      };
      current.totalBase += Number(item.basePay);
      current.totalAllowance += Number(item.allowance);
      current.totalDeduction += Number(item.deduction);
      current.taskCount += 1;
      summaryMap.set(empId, current);
    });
    return Array.from(summaryMap.values());
  });

  const grandTotal = () => employeeSummaries().reduce((acc, emp) => 
    acc + (emp.totalBase + emp.totalAllowance - emp.totalDeduction), 0
  );

  // 4. Fixed Submission: Calculate endsOn automatically
  const handleAddWeek = async (e: SubmitEvent) => {
    e.preventDefault();
    setIsAddingWeek(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const startStr = formData.get("startsOn") as string;
    
    // Logic: endsOn is 6 days after startsOn (Total 7-day period)
    const startDate = new Date(startStr);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    try {
      const res = await api.hr.weeks.$post({
        json: { 
          startsOn: startDate.toISOString(), 
          endsOn: endDate.toISOString() 
        }
      });
      
      if (res.ok) {
        await refetchWeeks();
        setIsWeekSheetOpen(false);
      }
    } catch (err) {
      console.error("Failed to create week:", err);
    } finally {
      setIsAddingWeek(false);
    }
  };

  return (
    <div class="space-y-8 max-w-7xl mx-auto p-4 md:p-0">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight uppercase italic flex items-center gap-2">
            {Wallet({ class: "text-slate-400" })} Payroll
          </h1>
          <p class="text-slate-500 text-sm font-medium italic text-slate-400">Production workforce payout consolidation</p>
        </div>
        
        <div class="flex items-center gap-3 w-full md:w-auto">
          <select 
            class="flex-1 md:flex-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-4 ring-slate-900/5 transition-all"
            onChange={(e) => setSelectedWeekId(e.currentTarget.value ? Number(e.currentTarget.value) : null)}
          >
            <option value="">Select Work Week...</option>
            <For each={weeks()}>
              {(week) => (
                <option value={week.id}>
                  Week Starting: {new Date(week.startsOn).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                </option>
              )}
            </For>
          </select>

          <Sheet open={isWeekSheetOpen()} onOpenChange={setIsWeekSheetOpen}>
            <SheetTrigger as={Button} variant="outline" class="rounded-xl border-slate-200 bg-white shadow-sm font-bold text-xs uppercase tracking-widest h-10">
              {Plus({ size: 16, class: "mr-2" })} New Week
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle class="font-black uppercase italic">Initialize Work Week</SheetTitle>
                <SheetDescription>Set the starting date. The system will automatically calculate the 7-day period.</SheetDescription>
              </SheetHeader>
              <form onSubmit={handleAddWeek} class="space-y-6 mt-8">
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase text-slate-400 tracking-widest">Opening Date (Monday)</label>
                  <Input type="date" name="startsOn" required class="h-12 rounded-xl border-slate-200" />
                </div>
                <Button type="submit" class="w-full bg-slate-900 h-12 rounded-xl font-bold uppercase tracking-widest text-xs" disabled={isAddingWeek()}>
                  <Show when={isAddingWeek()} fallback="Open Payroll Week">
                    {Loader2({ class: "animate-spin mr-2", size: 18 })} Opening...
                  </Show>
                </Button>
              </form>
            </SheetContent>
          </Sheet>

          <Button variant="outline" class="rounded-xl border-slate-200 shadow-sm px-3 h-10">
             {Printer({ size: 18 })}
          </Button>
        </div>
      </div>

      <Show when={selectedWeekId() && employeeSummaries().length > 0} fallback={
        <div class="h-80 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400 bg-slate-50/30 text-center px-4">
           {Calendar({ size: 64, strokeWidth: 1, class: "mb-4 opacity-20" })}
           <p class="font-black uppercase tracking-widest text-xs">Payroll Ledger Empty</p>
           <p class="text-[11px] mt-1 font-medium italic">Select a finalized week or initialize a new period to see earnings.</p>
        </div>
      }>
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div class="lg:col-span-3 bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
            <table class="w-full text-sm">
              <thead class="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <tr>
                  <th class="p-6 text-left">Personnel</th>
                  <th class="p-6 text-center">Tasks</th>
                  <th class="p-6 text-right">Gross</th>
                  <th class="p-6 text-right text-red-500/70">Deduct</th>
                  <th class="p-6 text-right font-black text-slate-900">Net Payable</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <For each={employeeSummaries()}>
                  {(emp) => (
                    <tr class="hover:bg-slate-50/30 transition-colors group">
                      <td class="p-6">
                        <div class="flex flex-col">
                          <span class="font-bold text-slate-900">{emp.name}</span>
                          <span class="text-[10px] text-slate-400 font-black tracking-tighter uppercase">{emp.phone}</span>
                        </div>
                      </td>
                      <td class="p-6 text-center">
                        <Badge class="bg-slate-900 text-white border-none rounded-lg text-[10px] px-2.5 font-mono">
                          {emp.taskCount}
                        </Badge>
                      </td>
                      <td class="p-6 text-right font-mono font-bold text-slate-600">
                        {emp.totalBase + emp.totalAllowance}
                      </td>
                      <td class="p-6 text-right font-mono text-red-500 font-bold">
                        ({emp.totalDeduction})
                      </td>
                      <td class="p-6 text-right">
                        <span class="text-lg font-black font-mono text-slate-900 tracking-tighter">
                          {(emp.totalBase + emp.totalAllowance - emp.totalDeduction).toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>

          <div class="space-y-6">
            <div class="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200 relative overflow-hidden border border-slate-800">
              <div class="relative z-10">
                <p class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Total Liability</p>
                <h2 class="text-5xl font-black font-mono tracking-tighter mb-10">
                  <span class="text-sm font-normal opacity-30 mr-2 uppercase italic">Kes</span>
                  {grandTotal().toLocaleString()}
                </h2>
                
                <div class="space-y-4">
                  <div class="flex justify-between text-xs border-b border-white/5 pb-4">
                    <span class="opacity-40 italic font-medium">Headcount</span>
                    <span class="font-black text-base">{employeeSummaries().length}</span>
                  </div>
                  <div class="flex justify-between text-xs border-b border-white/5 pb-4">
                    <span class="opacity-40 italic font-medium">Total Units</span>
                    <span class="font-black text-base">
                       {employeeSummaries().reduce((acc, curr) => acc + curr.taskCount, 0)}
                    </span>
                  </div>
                </div>

                <Button class="w-full mt-10 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl h-14 font-black uppercase tracking-widest text-xs gap-2 shadow-xl">
                   {BadgeCheck({ size: 20 })} Finalize Payout
                </Button>
                <Button variant="ghost" class="w-full mt-3 text-white/40 hover:text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-widest gap-2">
                   {FileSpreadsheet({ size: 16 })} Export CSV
                </Button>
              </div>
              <div class="absolute -top-24 -left-24 w-64 h-64 bg-slate-100/5 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
}