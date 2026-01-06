import { createSignal, createResource, For, Show } from "solid-js";
import { 
  UserPlus, Trash2, Loader2 
} from "lucide-solid";
import { Button } from "~/components/ui/button";
import { api } from "~/lib/api";

export default function UserManagementPage() {
  const [status, setStatus] = createSignal<"idle" | "loading" | "error">("idle");

  // Fetch all users with an initial value to prevent hydration flicker
  const [users, { refetch }] = createResource(async () => {
    try {
      const res = await api.auth.users.$get();
      return res.ok ? await res.json() : [];
    } catch (e) {
      return [];
    }
  }, { initialValue: [] });

  const handleCreateUser = async (e: SubmitEvent) => {
    e.preventDefault();
    setStatus("loading");
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    
    try {
      const res = await api.auth.signup.$post({
        json: {
          username: fd.get("username") as string,
          password: fd.get("password") as string,
          role: fd.get("role") as any,
        }
      });

      if (res.ok) {
        (e.target as HTMLFormElement).reset();
        await refetch();
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this user's access?")) return;
    try {
      await api.auth.users[":id"].$delete({ param: { id } });
      refetch();
    } catch (e) {
      console.error("Delete failed", e);
    }
  };

  return (
    <div class="p-8 space-y-12">
      <div class="flex justify-between items-end border-b border-slate-100 pb-8">
        <div>
          <h1 class="text-4xl font-black uppercase tracking-tighter">Personnel Management</h1>
          <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Manage System Access & Roles</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* CREATE USER FORM */}
        <div class="lg:col-span-4">
          <div class="bg-slate-50 p-8 border border-slate-200">
            <h2 class="text-xl font-black uppercase mb-6 flex items-center gap-2">
              {UserPlus({ size: 20, class: "text-amber-500" })} Onboard Staff
            </h2>
            <form onSubmit={handleCreateUser} class="space-y-6">
              <div class="space-y-1">
                <label class="text-[9px] font-black uppercase tracking-widest text-slate-500">Username</label>
                <input name="username" required class="w-full bg-white border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-slate-950" placeholder="e.g. j.doe" />
              </div>
              <div class="space-y-1">
                <label class="text-[9px] font-black uppercase tracking-widest text-slate-500">Default Password</label>
                <input name="password" type="password" required class="w-full bg-white border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-slate-950" placeholder="••••••••" />
              </div>
              <div class="space-y-1">
                <label class="text-[9px] font-black uppercase tracking-widest text-slate-500">System Role</label>
                <select name="role" class="w-full bg-white border border-slate-200 px-4 py-3 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
                  <option value="office">Office Staff</option>
                  <option value="foreman">Site Foreman</option>
                  <option value="admin">System Admin</option>
                </select>
              </div>
              <Button type="submit" disabled={status() === "loading"} class="w-full bg-slate-950 text-white font-black uppercase text-[10px] tracking-widest py-4 hover:bg-amber-600 transition-colors">
                <Show when={status() === "loading"} fallback="Generate Credentials">
                  {Loader2({ class: "animate-spin mx-auto" })}
                </Show>
              </Button>
            </form>
          </div>
        </div>

        {/* USER LIST */}
        <div class="lg:col-span-8">
          <div class="border border-slate-200 overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <th class="px-6 py-4">User</th>
                  <th class="px-6 py-4">Security Level</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <For each={users()}>
                  {(user) => (
                    <tr class="group hover:bg-slate-50/50 transition-colors">
                      <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                          <div class="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center font-black text-xs text-slate-400">
                            {user.username ? user.username[0].toUpperCase() : "?"}
                          </div>
                          <span class="font-bold text-sm">{user.username}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <span 
                          class="text-[9px] font-black uppercase px-2 py-1 tracking-tighter rounded"
                          classList={{
                            'bg-amber-100 text-amber-700': user.role === 'admin',
                            'bg-blue-100 text-blue-700': user.role === 'foreman',
                            'bg-slate-100 text-slate-600': user.role !== 'admin' && user.role !== 'foreman'
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(user.id)}
                          class="text-slate-300 hover:text-red-600 transition-colors p-2"
                          aria-label="Delete user"
                        >
                          {Trash2({ size: 16 })}
                        </button>
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
            <Show when={users().length === 0 && !users.loading}>
              <div class="p-12 text-center text-slate-400 text-xs font-black uppercase tracking-widest">
                No personnel found in records
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}