import { createResource, Suspense, Show, createMemo } from "solid-js";
import { dataService, type BrandflareData } from "~/services/data.service";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from "~/components/ui/card";
import { Chart } from "~/components/ui/charts";
import { 
  TrendingUp, 
  Users, 
  Receipt, 
  Package, 
  ArrowUpRight,
  Briefcase,
  Layers
} from "lucide-solid";

export default function DashboardHome() {
  const [data] = createResource<BrandflareData>(dataService.getDashboardData);

  // --- BUSINESS LOGIC ---
  const stats = createMemo(() => {
    const res = data();
    if (!res) return null;

    const totalRevenue = res.invoices
      .reduce((sum, i) => sum + Number(i.totalAmount || 0), 0);

    const pendingAmount = res.invoices
      .filter(i => i.status?.toLowerCase() !== 'paid')
      .reduce((sum, i) => sum + Number(i.totalAmount || 0), 0);

    return {
      revenue: totalRevenue,
      pending: pendingAmount,
      staffCount: res.employees.length,
      taskCount: res.tasks.length,
      clientCount: res.clients.length
    };
  });

  // --- CHART DATA FORMATTING ---
  // Chart.js requires labels (x-axis) and datasets (y-axis values)
  const revenueChartData = createMemo(() => {
    const res = data();
    if (!res || !res.invoices) return { labels: [], datasets: [] };

    const lastSixInvoices = res.invoices.slice(-6);
    
    return {
      labels: lastSixInvoices.map(i => 
        new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ),
      datasets: [
        {
          label: "Revenue",
          data: lastSixInvoices.map(i => Number(i.totalAmount)),
          backgroundColor: "rgba(245, 158, 11, 0.1)", // Amber with transparency
          borderColor: "#f59e0b",
          fill: true, // This creates the "Area" effect
          tension: 0.4, // Smooth curves
        }
      ]
    };
  });

  const formatKES = (val: number | undefined) => 
    (val || 0).toLocaleString('en-KE', { 
      style: 'currency', 
      currency: 'KES', 
      minimumFractionDigits: 0 
    });

  return (
    <div class="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 bg-white min-h-screen">
      
      {/* BRANDFLARE HEADER */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-8">
        <div>
          <h1 class="text-4xl font-black tracking-tight text-slate-900 uppercase">
            Executive <span class="text-amber-500">Suite</span>
          </h1>
          <p class="text-slate-500 font-semibold text-sm mt-1">
            Brandflare Woodworks Performance Overview
          </p>
        </div>
        <div class="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
          <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">System Live</span>
        </div>
      </div>

      <Suspense fallback={
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          <div class="h-32 bg-slate-100 rounded-3xl col-span-4" />
        </div>
      }>
        <Show when={stats()}>
          {(s) => (
            <div class="space-y-8">
              
              {/* KPI ROW */}
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card class="border-none bg-slate-50 shadow-none rounded-3xl">
                  <CardHeader class="flex flex-row items-center justify-between pb-2">
                    <CardTitle class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Revenue</CardTitle>
                    <TrendingUp class="text-amber-500" size={16} />
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-black text-slate-900">{formatKES(s().revenue)}</div>
                    <div class="flex items-center gap-1 text-emerald-600 text-[10px] font-bold mt-2">
                      <ArrowUpRight size={12} /> Positive Growth
                    </div>
                  </CardContent>
                </Card>

                <Card class="border-none bg-slate-50 shadow-none rounded-3xl">
                  <CardHeader class="flex flex-row items-center justify-between pb-2">
                    <CardTitle class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Receivables</CardTitle>
                    <Receipt class="text-slate-900" size={16} />
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-black text-slate-900">{formatKES(s().pending)}</div>
                    <div class="text-[10px] font-bold text-slate-400 mt-2 uppercase">Unpaid Total</div>
                  </CardContent>
                </Card>

                <Card class="border-none bg-slate-50 shadow-none rounded-3xl">
                  <CardHeader class="flex flex-row items-center justify-between pb-2">
                    <CardTitle class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Workforce</CardTitle>
                    <Users class="text-slate-900" size={16} />
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-black text-slate-900">{s().staffCount}</div>
                    <div class="text-[10px] font-bold text-slate-400 mt-2 uppercase">Personnel</div>
                  </CardContent>
                </Card>

                <Card class="border-none bg-amber-500 shadow-lg shadow-amber-200 rounded-3xl">
                  <CardHeader class="flex flex-row items-center justify-between pb-2">
                    <CardTitle class="text-[10px] font-black uppercase tracking-[0.2em] text-white">Production</CardTitle>
                    <Package class="text-white" size={16} />
                  </CardHeader>
                  <CardContent>
                    <div class="text-2xl font-black text-white">{s().taskCount}</div>
                    <div class="text-[10px] font-bold text-white/80 mt-2 uppercase tracking-tighter">Active Tasks</div>
                  </CardContent>
                </Card>
              </div>

              {/* CHART SECTION */}
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card class="rounded-3xl border-slate-100 shadow-xl shadow-slate-100/50">
                  <CardHeader>
                    <div class="flex items-center gap-2 mb-1">
                      <Layers size={16} class="text-amber-500" />
                      <CardTitle class="text-lg font-black uppercase tracking-tight">Financial Inflow</CardTitle>
                    </div>
                    <CardDescription class="text-xs font-medium">Revenue tracking across recent invoices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div class="h-[300px] w-full">
                      {/* Type "line" + fill: true in dataset = Area Chart. 
                        Data object must contain 'labels' and 'datasets'.
                      */}
                      <Chart 
                        type="line" 
                        data={revenueChartData()} 
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: {
                            y: { display: false },
                            x: { grid: { display: false } }
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* PULSE SECTION */}
                <div class="space-y-6">
                  <Card class="rounded-3xl border-none bg-slate-900 text-white p-6">
                    <CardHeader class="p-0 mb-6">
                      <CardTitle class="text-sm font-black uppercase tracking-widest text-amber-500">Operational Pulse</CardTitle>
                    </CardHeader>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p class="text-[10px] font-black text-slate-500 uppercase">Total Clients</p>
                        <p class="text-2xl font-black mt-1">{s().clientCount}</p>
                      </div>
                      <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p class="text-[10px] font-black text-slate-500 uppercase">Production Queue</p>
                        <p class="text-2xl font-black mt-1">{s().taskCount}</p>
                      </div>
                    </div>
                  </Card>

                  <Card class="rounded-3xl border-slate-100 shadow-sm p-6">
                    <div class="flex items-center gap-4">
                      <div class="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                        <Briefcase size={24} />
                      </div>
                      <div>
                        <p class="text-sm font-black text-slate-900 uppercase">Latest Engagement</p>
                        <p class="text-xs text-slate-400 font-medium">
                          Active Client: <span class="text-slate-900 font-bold">{data()?.clients[0]?.name || 'No Clients'}</span>
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </Show>
      </Suspense>
    </div>
  );
}