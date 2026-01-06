import { A, useNavigate } from "@solidjs/router";
import { For, createResource, Show } from "solid-js";
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays,
  UserCircle,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Receipt,
  Wallet,
  CheckSquare,
  UserCog,
  Logs,
  Loader2
} from "lucide-solid";
import { Button } from "~/components/ui/button";
import { api } from "~/lib/api";

interface UserProfile {
  id: string;
  username: string;
  role: "admin" | "foreman" | "office";
}

const fetchUser = async (): Promise<UserProfile | null> => {
  try {
    const res = await api.auth.me.$get();
    if (!res.ok) return null;
    const data = (await res.json()) as { user: UserProfile | null };
    return data.user; 
  } catch (e) {
    console.error("Session fetch failed", e);
    return null;
  }
};

export default function DashboardLayout(props: { children?: any }) {
  const navigate = useNavigate();
  // Using a resource is great for SSR, as it will be serialized and sent to client
  const [user] = createResource<UserProfile | null>(fetchUser);

  const handleLogout = async () => {
    try {
      const res = await api.auth.logout.$post();
      if (res.ok) {
        window.location.href = "/sign-in";
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const sections = [
    {
      title: "Main",
      items: [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      ]
    },
    {
      title: "Finance & Sales",
      items: [
        { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
        { href: "/dashboard/clients", label: "Clients", icon: Users },
      ]
    },
    {
      title: "HR Department",
      items: [
        { href: "/dashboard/employees", label: "Workforce", icon: UserCircle },
        { href: "/dashboard/worksheet", label: "Weekly Worksheet", icon: CalendarDays },
        { href: "/dashboard/payroll", label: "Payroll", icon: Wallet },
        { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
        { href: "/dashboard/user-management", label: "Users", icon: UserCog },
      ]
    }
  ];

  return (
    <div class="flex min-h-screen bg-slate-50/50">
      {/* Sidebar */}
      <aside class="hidden md:flex w-72 flex-col border-r bg-white px-4 py-6 sticky top-0 h-screen">
        
        <div class="px-6 mb-8 flex items-center gap-3">
          <div class="h-9 w-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
            {Logs({ size: 20 })}
          </div>
          <div class="flex flex-col">
            <span class="font-bold text-lg leading-none tracking-tight text-slate-900">Brandflare</span>
            <span class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Woodworks ERP</span>
          </div>
        </div>

        <div class="flex-1 space-y-8 overflow-y-auto custom-scrollbar">
          <For each={sections}>
            {(section) => (
              <div class="space-y-2">
                <h2 class="px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  {section.title}
                </h2>
                <nav class="space-y-1 px-2">
                  <For each={section.items}>
                    {(item) => (
                      <A
                        href={item.href}
                        end={item.href === "/dashboard"}
                        activeClass="bg-slate-900 text-white shadow-md shadow-slate-200"
                        inactiveClass="text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        class="group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
                      >
                        {item.icon({ size: 18, class: "transition-colors" })}
                        <span class="flex-1">{item.label}</span>
                        {ChevronRight({ 
                           size: 14, 
                           class: "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" 
                        })}
                      </A>
                    )}
                  </For>
                </nav>
              </div>
            )}
          </For>
        </div>

        {/* Dynamic User Section */}
        <div class="mt-auto pt-6 border-t border-slate-100">
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 overflow-hidden">
                    <Show 
                        when={!user.loading} 
                        fallback={Loader2({ size: 20, class: "animate-spin opacity-20" })}
                    >
                      {UserCircle({ size: 40, strokeWidth: 1.5 })}
                    </Show>
                </div>
                <div class="flex-1 overflow-hidden">
                    <Show 
                        when={!user.loading} 
                        fallback={<div class="h-4 w-20 bg-slate-200 animate-pulse rounded" />}
                    >
                      <p class="text-sm font-bold text-slate-900 truncate">
                        {user()?.username || "Guest User"}
                      </p>
                      <p class="text-[10px] text-slate-400 font-medium uppercase flex items-center gap-1">
                         {ShieldCheck({ 
                            size: 10, 
                            class: user()?.role === 'admin' ? "text-amber-500" : "text-green-500" 
                         })} 
                         {user()?.role || 'Limited'} Access
                      </p>
                    </Show>
                </div>
              </div>
          </div>
          
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            class="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl gap-3 px-4"
          >
            {LogOut({ size: 18 })}
            <span class="text-sm font-bold">Sign Out</span>
          </Button>
        </div>
      </aside>

      <main class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header class="h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 no-print">
            <h1 class="text-sm font-bold text-slate-400 uppercase tracking-widest">Workshop Management</h1>
            <div class="flex items-center gap-4">
                <div class="h-8 w-px bg-slate-100" />
                <p class="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Build v1.0.4</p>
            </div>
        </header>

        <div class="flex-1 overflow-y-auto p-8 bg-[#fbfcfd]">
          {/* props.children is handled safely as long as components inside follow these rules */}
          {props.children}
        </div>
      </main>
    </div>
  );
}