import { createSignal, Show } from "solid-js";
import { 
  Phone, Mail, MapPin, 
  Send, Instagram, Facebook, 
  MessageSquare, HardHat, Loader2, CheckCircle2, AlertCircle
} from "lucide-solid";
import { Button } from "~/components/ui/button";
import { api } from "~/lib/api";

export default function ContactPage() {
  const [status, setStatus] = createSignal<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = createSignal("");

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (status() === "sending") return;

    setStatus("sending");
    setErrorMessage("");

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    const payload = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      type: formData.get("type") as string,
      location: formData.get("location") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await api.contact.inquiry.$post({ json: payload });
      
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const errData = await res.json() as any;
        const msg = errData.success === false ? errData.error?.message : "Server error occurred";
        setErrorMessage(msg || "Check form details.");
        setStatus("error");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage("Network error. Please check your connection.");
      setStatus("error");
    }
  };

  return (
    <div class="bg-white min-h-screen pt-20">
      {/* 1. HERO HEADER */}
      <section class="py-24 border-b border-slate-100 bg-slate-50">
        <div class="container mx-auto px-6">
          <div class="max-w-4xl">
            <h1 class="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
              Start Your <br/> <span class="text-amber-500">Build.</span>
            </h1>
            <p class="text-slate-500 text-lg md:text-xl font-medium max-w-xl uppercase tracking-tight leading-relaxed">
              From foundation to final gypsum finish, our engineering team is ready to consult on your next project.
            </p>
          </div>
        </div>
      </section>

      {/* 2. CONTACT GRID */}
      <section class="container mx-auto px-6 py-24">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* LEFT COLUMN: CONTACT DETAILS */}
          <div class="lg:col-span-5 space-y-16">
            <div class="space-y-12">
              <div class="group flex items-start gap-6">
                <div class="w-14 h-14 bg-slate-950 text-amber-500 flex items-center justify-center flex-shrink-0 transition-transform group-hover:-rotate-6">
                  {Phone({ size: 24 })}
                </div>
                <div>
                  <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Direct Line</h3>
                  <p class="text-2xl font-black text-slate-950">+254 712 345 678</p>
                  <p class="text-sm text-slate-500 font-medium mt-1">Mon - Sat, 8am - 6pm</p>
                </div>
              </div>

              <div class="group flex items-start gap-6">
                <div class="w-14 h-14 bg-slate-950 text-amber-500 flex items-center justify-center flex-shrink-0 transition-transform group-hover:-rotate-6">
                  {Mail({ size: 24 })}
                </div>
                <div>
                  <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Project Inquiries</h3>
                  <p class="text-2xl font-black text-slate-950">projects@brandflare.co.ke</p>
                  <p class="text-sm text-slate-500 font-medium mt-1">Expect a response within 24hrs</p>
                </div>
              </div>

              <div class="group flex items-start gap-6">
                <div class="w-14 h-14 bg-slate-950 text-amber-500 flex items-center justify-center flex-shrink-0 transition-transform group-hover:-rotate-6">
                  {MapPin({ size: 24 })}
                </div>
                <div>
                  <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">HQ Address</h3>
                  <p class="text-2xl font-black text-slate-950">Industrial Area, Nairobi</p>
                  <p class="text-sm text-slate-500 font-medium mt-1">Enterprise Road, Block C</p>
                </div>
              </div>
            </div>

            {/* TECHNICAL ADVISORY BOX */}
            <div class="p-10 bg-slate-950 text-white space-y-4 relative overflow-hidden">
              <div class="absolute top-0 right-0 p-4 opacity-10">
                {HardHat({ size: 80 })}
              </div>
              <div class="flex items-center gap-3 relative z-10">
                <div class="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Site Assessments</span>
              </div>
              <p class="text-slate-400 text-sm font-medium leading-relaxed relative z-10">
                We provide on-site technical evaluations across the country to ensure accurate structural quoting and project feasibility.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: INQUIRY FORM */}
          <div class="lg:col-span-7">
            <div class="bg-white border border-slate-200 p-8 md:p-12 shadow-2xl relative min-h-[600px]">
              
              <Show when={status() === "success"}>
                <div class="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center text-center p-12">
                  <div class="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                    {CheckCircle2({ size: 48 })}
                  </div>
                  <h2 class="text-3xl font-black uppercase tracking-tighter mb-4">Brief Received</h2>
                  <p class="text-slate-500 font-medium max-w-sm mb-8">
                    Thank you. Our project engineers have been notified and will review your requirements immediately.
                  </p>
                  <Button 
                    onClick={() => setStatus("idle")} 
                    class="bg-slate-950 text-white font-black px-8 py-4 rounded-none uppercase text-[10px] tracking-widest"
                  >
                    Send Another Inquiry
                  </Button>
                </div>
              </Show>

              <div class="mb-12">
                <h2 class="text-4xl font-black uppercase tracking-tight mb-2">Project Brief</h2>
                <p class="text-slate-500 text-sm font-medium uppercase tracking-wide">Submit your site details for a professional quote.</p>
              </div>

              <form onSubmit={handleSubmit} class="space-y-10">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div class="space-y-3">
                    <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                    <input 
                      name="name"
                      required
                      class="w-full bg-transparent border-b-2 border-slate-200 py-3 focus:border-amber-500 outline-none transition-all font-black text-sm uppercase" 
                      placeholder="CONTACT PERSON" 
                    />
                  </div>
                  <div class="space-y-3">
                    <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Phone Number</label>
                    <input 
                      name="phone"
                      required
                      type="tel"
                      class="w-full bg-transparent border-b-2 border-slate-200 py-3 focus:border-amber-500 outline-none transition-all font-black text-sm uppercase" 
                      placeholder="+254 --- --- ---" 
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div class="space-y-3">
                    <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Category</label>
                    <select 
                      name="type"
                      class="w-full bg-transparent border-b-2 border-slate-200 py-3 focus:border-amber-500 outline-none transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer"
                    >
                      <option value="Housing Construction">Housing Construction</option>
                      <option value="Interior Fitting">Interior Fitting</option>
                      <option value="Gypsum & Finishing">Gypsum & Finishing</option>
                      <option value="Consultation">Technical Consultation</option>
                    </select>
                  </div>
                  <div class="space-y-3">
                    <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Location</label>
                    <input 
                      name="location"
                      required
                      class="w-full bg-transparent border-b-2 border-slate-200 py-3 focus:border-amber-500 outline-none transition-all font-black text-sm uppercase" 
                      placeholder="TOWN / ESTATE" 
                    />
                  </div>
                </div>

                <div class="space-y-3">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Requirements</label>
                  <textarea 
                    name="message"
                    required
                    rows={4} 
                    class="w-full bg-transparent border-b-2 border-slate-200 py-3 focus:border-amber-500 outline-none transition-all font-black text-sm uppercase resize-none" 
                    placeholder="DESCRIBE THE SCOPE OF WORK..."
                  ></textarea>
                </div>

                <div class="pt-6">
                  <Button 
                    type="submit"
                    disabled={status() === "sending"}
                    class="w-full bg-slate-950 text-white font-black uppercase tracking-[0.3em] py-8 rounded-none hover:bg-amber-600 transition-all flex items-center justify-center gap-4 disabled:opacity-70"
                  >
                    <Show when={status() === "sending"} fallback={
                      <div class="flex items-center gap-2">
                        {Send({ size: 18 })} <span>Send Project Brief</span>
                      </div>
                    }>
                      {Loader2({ size: 18, class: "animate-spin" })} <span>Processing...</span>
                    </Show>
                  </Button>
                  
                  <Show when={status() === "error"}>
                    <div class="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-3 justify-center">
                      {AlertCircle({ size: 16 })}
                      <span class="text-[10px] font-black uppercase tracking-widest">{errorMessage() || "Failed to send inquiry."}</span>
                    </div>
                  </Show>
                </div>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* 3. WHATSAPP FAST-TRACK */}
      <section class="bg-slate-50 py-24 border-t border-slate-100">
        <div class="container mx-auto px-6 text-center space-y-8">
          {MessageSquare({ size: 32, class: "mx-auto text-amber-500" })}
          <h2 class="text-4xl font-black uppercase tracking-tighter">Fast-Track Your Quote</h2>
          <p class="text-slate-500 max-w-lg mx-auto font-medium text-lg">
            Prefer instant communication? Start a chat with our project lead for immediate feedback.
          </p>
          <Button variant="outline" class="border-2 border-slate-950 text-slate-950 font-black px-12 py-8 rounded-none hover:bg-slate-950 hover:text-white transition-all uppercase text-xs tracking-[0.2em]">
            Chat via WhatsApp
          </Button>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer class="py-12 border-t border-slate-100 bg-white">
        <div class="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div class="flex items-center gap-2">
             <div class="w-10 h-10 bg-slate-950 text-white flex items-center justify-center font-black">B</div>
             <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Brandflare Group Kenya</p>
          </div>
          <div class="flex gap-8 text-slate-400">
            {Instagram({ size: 20, class: "hover:text-slate-950 cursor-pointer transition-colors" })}
            {Facebook({ size: 20, class: "hover:text-slate-950 cursor-pointer transition-colors" })}
          </div>
        </div>
      </footer>
    </div>
  );
}