import { createSignal, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { Lock, User, Loader2, AlertCircle, ChevronRight } from "lucide-solid";
import { Button } from "~/components/ui/button";
import { api } from "~/lib/api";

export default function SignInPage() {
  const [status, setStatus] = createSignal<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = createSignal("");
  const navigate = useNavigate();

  const handleSignIn = async (e: SubmitEvent) => {
    e.preventDefault();
    
    // Safety: Ensure we don't trigger while already loading
    if (status() === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const res = await api.auth.login.$post({
        json: { username, password }
      });

      if (res.ok) {
        // Full reload ensures all global state and headers are fresh
        window.location.href = "/dashboard";
      } else {
        const data = await res.json() as { message?: string };
        setErrorMsg(data.message || "Invalid credentials");
        setStatus("error");
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setErrorMsg("Terminal Connection Failed");
      setStatus("error");
    }
  };

  return (
    <div class="min-h-screen bg-white flex flex-col md:flex-row overflow-x-hidden">
      {/* LEFT: VISUAL BRANDING */}
      <div class="hidden md:flex md:w-1/2 bg-slate-950 p-16 flex-col justify-between relative overflow-hidden">
        {/* Background Texture/Image */}
        <div class="absolute inset-0 opacity-30 pointer-events-none">
           <img 
             src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000" 
             alt="Factory background"
             class="w-full h-full object-cover grayscale brightness-50" 
           />
           {/* Scanline overlay effect */}
           <div class="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%]" />
        </div>
        
        <div class="relative z-10">
          <div class="w-14 h-14 bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-2xl">
            B
          </div>
        </div>

        <div class="relative z-10 space-y-4">
          <div class="h-1 w-24 bg-amber-500 mb-8" />
          <h2 class="text-6xl font-black text-white uppercase tracking-tighter leading-[0.9] mb-4">
            Industrial <br/> <span class="text-amber-500">Logistics</span>
          </h2>
          <div class="flex items-center gap-4">
             <p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap">Proprietary Workforce Portal</p>
             <div class="h-[1px] w-full bg-slate-800" />
          </div>
        </div>
      </div>

      {/* RIGHT: SIGN IN FORM */}
      <div class="flex-1 flex items-center justify-center p-8 md:p-24 bg-white">
        <div class="w-full max-w-sm space-y-16">
          <div class="space-y-6">
            <h1 class="text-5xl font-black uppercase tracking-tighter text-slate-950 italic">
              Authorize<span class="text-amber-500">.</span>
            </h1>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Enter credentials to establish terminal link</p>
          </div>

          <form onSubmit={handleSignIn} class="space-y-10">
            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identity Identifier</label>
              <div class="relative">
                {User({ size: 20, class: "absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" })}
                <input 
                  name="username"
                  required
                  type="text" 
                  autocomplete="username"
                  class="w-full bg-transparent border-b-2 border-slate-100 pl-10 py-4 focus:border-amber-500 outline-none transition-all font-black text-sm uppercase placeholder:text-slate-200" 
                  placeholder="EMP-NUMBER"
                />
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Cipher</label>
              <div class="relative">
                {Lock({ size: 20, class: "absolute left-0 top-1/2 -translate-y-1/2 text-slate-300" })}
                <input 
                  name="password"
                  required
                  type="password" 
                  autocomplete="current-password"
                  class="w-full bg-transparent border-b-2 border-slate-100 pl-10 py-4 focus:border-amber-500 outline-none transition-all font-black text-sm placeholder:text-slate-200" 
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Show when={status() === "error"}>
              <div class="flex items-center gap-3 p-4 bg-red-50 text-red-600 border border-red-100 rounded-sm">
                {AlertCircle({ size: 18, class: "shrink-0" })}
                <span class="text-[10px] font-black uppercase tracking-widest leading-none">{errorMsg()}</span>
              </div>
            </Show>

            <div class="pt-4">
                <Button 
                type="submit"
                disabled={status() === "loading"}
                class="w-full bg-slate-950 text-white font-black uppercase tracking-[0.3em] py-10 rounded-none hover:bg-amber-500 hover:text-slate-950 transition-all flex items-center justify-center gap-4 disabled:opacity-50 group border-none shadow-xl shadow-slate-100"
                >
                <Show 
                    when={status() === "loading"} 
                    fallback={
                    <>
                        Access System {ChevronRight({ size: 18, class: "group-hover:translate-x-2 transition-transform" })}
                    </>
                    }
                >
                    {Loader2({ size: 20, class: "animate-spin" })}
                    <span>Establishing Link...</span>
                </Show>
                </Button>
            </div>
          </form>

          <div class="pt-12 border-t border-slate-100">
             <p class="text-[9px] text-slate-400 font-bold uppercase tracking-[0.15em] leading-relaxed">
               Secure Environment Warning: Authorized Personnel Only. <br/>
               IP Address and session metadata are being recorded.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}