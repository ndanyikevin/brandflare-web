import { For, Show } from "solid-js";
import { 
  Drill, Layers, 
  Instagram, Mail, Phone, CheckCircle2,
  Construction, Loader2
} from "lucide-solid";
import { Button } from "~/components/ui/button";
import { A, useAction, useSubmission } from "@solidjs/router";
import { sendProjectBrief } from "~/lib/actions";

export default function LandingPage() {
  const submitAction = useAction(sendProjectBrief);
  const submission = useSubmission(sendProjectBrief);

  const services = [
    { 
      title: "Housing & Construction", 
      desc: "Complete building solutions from site preparation to structural completion. We deliver durable, modern residential and commercial units.",
      icon: Construction
    },
    { 
      title: "Interior Fitting & Finishing", 
      desc: "Precision cabinetry, high-end floor tiling, and wall finishes that transform shells into luxury living spaces.",
      icon: Drill
    },
    { 
      title: "Gypsum & Ceiling Systems", 
      desc: "Advanced ceiling engineering featuring multi-level gypsum designs and integrated lighting solutions.",
      icon: Layers
    }
  ];

  return (
    <div class="bg-white min-h-screen font-sans text-slate-900 scroll-smooth">
      
      {/* 1. HERO */}
      <section class="relative h-screen flex items-center justify-center overflow-hidden bg-slate-950">
        <div class="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=2070" 
            class="w-full h-full object-cover opacity-50" 
            alt="Structural construction"
          />
          <div class="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
        </div>
        
        <div class="container mx-auto px-6 relative z-10 text-center">
          <div class="max-w-5xl mx-auto">
            <div class="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/10">
               <span class="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
               <span class="text-white font-black uppercase tracking-[0.2em] text-[10px]">
                 Available for 2026 Projects
               </span>
            </div>
            
            <h1 class="text-7xl md:text-[10rem] font-black text-white leading-[0.8] tracking-tighter mb-8">
              Brandflare <br/> 
              <span class="text-amber-500">Woodworks</span>
            </h1>
            
            <p class="text-lg md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
              We provide expert housing construction, premium interior fittings, 
              and architectural gypsum finishes across Kenya.
            </p>
            
            <div class="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
              <A href="#contact" class="w-full md:w-auto">
                <Button class="bg-amber-600 hover:bg-amber-500 text-white font-black px-12 py-8 rounded-none text-xs uppercase tracking-widest transition-all w-full md:w-auto">
                  Request a Quote
                </Button>
              </A>
              <Button variant="outline" class="text-white border-white/30 hover:bg-white hover:text-slate-950 px-12 py-8 rounded-none text-xs uppercase tracking-widest transition-all w-full md:w-auto">
                View Projects
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST BAR */}
      <div class="bg-slate-50 py-16 border-b border-slate-200">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-12 items-center text-center">
              <div>
                <p class="text-4xl font-black text-slate-900 mb-1">100%</p>
                <p class="text-[10px] text-slate-500 font-black uppercase tracking-widest">Safety Compliance</p>
              </div>
              <div>
                <p class="text-4xl font-black text-slate-900 mb-1">NCA</p>
                <p class="text-[10px] text-slate-500 font-black uppercase tracking-widest">Compliant</p>
              </div>
              <div>
                <p class="text-4xl font-black text-slate-900 mb-1">24/7</p>
                <p class="text-[10px] text-slate-500 font-black uppercase tracking-widest">Site Supervision</p>
              </div>
              <div>
                <p class="text-4xl font-black text-slate-900 mb-1">5YR</p>
                <p class="text-[10px] text-slate-500 font-black uppercase tracking-widest">Workmanship Warranty</p>
              </div>
          </div>
        </div>
      </div>

      {/* 3. SERVICE GRID */}
      <section class="py-32 container mx-auto px-6">
        <div class="max-w-3xl mb-24">
            <h2 class="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              Engineering <br/> Excellence.
            </h2>
            <div class="h-2 w-32 bg-amber-500"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
          <For each={services}>{(item) => (
            <div class="space-y-8 group">
              <div class="w-16 h-16 bg-slate-900 text-amber-500 flex items-center justify-center transition-transform group-hover:-rotate-12 duration-300">
                <item.icon size={32} />
              </div>
              <div class="space-y-4">
                <h3 class="text-2xl font-black uppercase tracking-tight">{item.title}</h3>
                <p class="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
              </div>
              <ul class="space-y-4 pt-4 border-t border-slate-100">
                <li class="flex items-center gap-3 text-xs font-black uppercase text-slate-900">
                  <CheckCircle2 size={16} class="text-amber-600" /> Professional Grade
                </li>
                <li class="flex items-center gap-3 text-xs font-black uppercase text-slate-900">
                  <CheckCircle2 size={16} class="text-amber-600" /> Precision Execution
                </li>
              </ul>
            </div>
          )}</For>
        </div>
      </section>

      {/* 4. FOOTER / CONTACT */}
      <footer id="contact" class="bg-white pt-32 pb-12 border-t border-slate-100">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32 items-start">
            <div class="space-y-12">
               <h2 class="text-6xl font-black uppercase tracking-tighter leading-tight">Build with <br/> Brandflare.</h2>
               <div class="space-y-6">
                 <div class="flex items-center gap-6">
                    <div class="w-12 h-12 bg-slate-50 flex items-center justify-center border border-slate-200">
                       <Phone size={18} />
                    </div>
                    <div>
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Us</p>
                      <p class="font-black">+254 727 605 092</p>
                    </div>
                 </div>
                 <div class="flex items-center gap-6">
                    <div class="w-12 h-12 bg-slate-50 flex items-center justify-center border border-slate-200">
                       <Mail size={18} />
                    </div>
                    <div>
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Project Brief</p>
                      <p class="font-black">projects@brandflarewoodworks.com</p>
                    </div>
                 </div>
              </div>
            </div>
            
            <div class="relative">
              <Show when={submission.result?.success}>
                <div class="absolute inset-0 bg-amber-500 z-20 flex flex-col items-center justify-center text-center p-12">
                  <CheckCircle2 size={64} class="text-slate-950 mb-4" />
                  <h3 class="text-2xl font-black uppercase text-slate-950">Brief Received</h3>
                  <p class="text-slate-900 font-bold mt-2">We will contact you within 24 hours.</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    class="mt-8 bg-slate-950 text-white rounded-none uppercase font-black text-xs px-8"
                  >
                    Send Another
                  </Button>
                </div>
              </Show>

              <form action={sendProjectBrief} method="post" class="space-y-6 bg-slate-950 p-12 shadow-2xl">
                <h4 class="text-white font-black uppercase tracking-widest text-sm mb-4">Request Project Quotation</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input name="name" required placeholder="NAME" class="bg-slate-900 text-white px-6 py-4 outline-none border border-slate-800 focus:border-amber-500 transition-all font-black text-xs" />
                  <input name="location" required placeholder="LOCATION (e.g. Kiamumbi)" class="bg-slate-900 text-white px-6 py-4 outline-none border border-slate-800 focus:border-amber-500 transition-all font-black text-xs" />
                </div>
                <input name="contact" required placeholder="PHONE / EMAIL" class="w-full bg-slate-900 text-white px-6 py-4 outline-none border border-slate-800 focus:border-amber-500 transition-all font-black text-xs" />
                <textarea name="description" required placeholder="PROJECT DESCRIPTION (e.g. Gypsum and Joinery at Pinnacle Tower)" rows={4} class="w-full bg-slate-900 text-white px-6 py-4 outline-none border border-slate-800 focus:border-amber-500 transition-all font-black text-xs resize-none"></textarea>
                
                <Button 
                  type="submit" 
                  disabled={submission.pending}
                  class="w-full bg-amber-500 py-8 font-black uppercase tracking-widest text-slate-950 hover:bg-white transition-all text-xs flex items-center justify-center gap-2"
                >
                  <Show when={submission.pending} fallback="Submit for Review">
                    <Loader2 class="animate-spin" size={16} /> Processing...
                  </Show>
                </Button>
                
                <Show when={submission.result?.error}>
                  <p class="text-red-500 text-[10px] font-black uppercase text-center mt-4">
                    {submission.result?.error}
                  </p>
                </Show>
              </form>
            </div>
          </div>
          
          <div class="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex items-center gap-2">
               <A href="/" class="flex items-center gap-2">
                  <img
                    src="/logos/black.png"
                    alt="Brandflare Logo"
                    class="h-12 w-auto object-contain"
                  />
                </A>
            </div>
            <div class="flex gap-8 items-center">
              <Instagram size={18} class="text-slate-400 hover:text-slate-950 cursor-pointer" />
              <p class="text-slate-700 text-[10px] font-black uppercase tracking-widest">© {new Date().getFullYear()} All Rights Reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}