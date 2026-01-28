import { Show, type Component } from "solid-js";
import { 
  Phone, Mail, MapPin, 
  Send, Instagram, Facebook, 
  MessageSquare, HardHat, Loader2, CheckCircle2, AlertCircle
} from "lucide-solid";
import { Button } from "~/components/ui/button";
import { useSubmission } from "@solidjs/router";
import { sendContactInquiry } from "~/lib/actions";

const ContactPage: Component = () => {
  const submission = useSubmission(sendContactInquiry);

  return (
    <div class="bg-white min-h-screen">
      {/* 1. HERO HEADER */}
      <section class="pt-32 pb-20 border-b border-slate-100 bg-slate-50">
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
      <section class="container mx-auto px-6 py-24 " id="contact-grid">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          <div class="lg:col-span-5 space-y-16">
            <div class="space-y-12">
              <ContactInfoItem 
                icon={Phone} 
                label="Direct Line" 
                value="+254 727 605 092" 
                subtext="Mon - Sat, 8am - 6pm" 
              />
              <ContactInfoItem 
                icon={Mail} 
                label="Project Inquiries" 
                value="projects@brandflarewoodworks.com" 
                subtext="Expect a response within 24hrs" 
              />
              <ContactInfoItem 
                icon={MapPin} 
                label="HQ Address" 
                value="Nairobi, Kenya" 
                subtext="Available for projects nationwide" 
              />
            </div>

            <div class="p-10 bg-slate-950 text-white space-y-4 relative overflow-hidden group">
              <div class="absolute -top-4 -right-4 p-4 opacity-10 transition-transform group-hover:scale-110 duration-500">
                <HardHat size={120} />
              </div>
              <div class="flex items-center gap-3 relative z-10">
                <div class="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500">Site Assessments</span>
              </div>
              <p class="text-slate-400 text-sm font-medium leading-relaxed relative z-10">
                We provide on-site technical evaluations across the country to ensure accurate structural quoting and project feasibility.
              </p>
            </div>
          </div>

          <div class="lg:col-span-7">
            <div class="bg-white border border-slate-200 p-8 md:p-12 shadow-2xl relative overflow-hidden">
              
              <Show when={submission.result?.success}>
                <div class="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center text-center p-12">
                  <div class="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 class="text-3xl font-black uppercase tracking-tighter mb-4 text-slate-950">Brief Received</h2>
                  <p class="text-slate-500 font-medium max-w-sm mb-8">
                    Thank you. Our project engineers have been notified and will review your requirements immediately.
                  </p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    class="bg-slate-950 text-white font-black px-8 py-4 rounded-none uppercase text-[10px] tracking-widest hover:bg-amber-500 transition-colors"
                  >
                    Send Another Inquiry
                  </Button>
                </div>
              </Show>

              <div class="mb-12 border-l-4 border-amber-500 pl-6">
                <h2 class="text-4xl font-black uppercase tracking-tight mb-2 text-slate-950">Project Brief</h2>
                <p class="text-slate-500 text-sm font-medium uppercase tracking-wide">Submit site details for a professional quote.</p>
              </div>

              <form action={sendContactInquiry} method="post" class="space-y-10">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <FormInput name="name" label="Full Name" placeholder="CONTACT PERSON" />
                  <FormInput name="phone" label="Phone Number" placeholder="+254 --- --- ---" type="tel" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div class="space-y-3">
                    <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Category</label>
                    <select 
                      name="type"
                      class="w-full bg-transparent border-b-2 border-slate-200 py-3 focus:border-amber-500 outline-none transition-all font-black text-[11px] uppercase tracking-widest cursor-pointer appearance-none text-slate-950"
                    >
                      <option value="Housing Construction">Housing Construction</option>
                      <option value="Interior Fitting">Interior Fitting</option>
                      <option value="Gypsum & Finishing">Gypsum & Finishing</option>
                      <option value="Consultation">Technical Consultation</option>
                    </select>
                  </div>
                  <FormInput name="location" label="Project Location" placeholder="TOWN / ESTATE" />
                </div>

                <div class="space-y-3">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Requirements</label>
                  <textarea 
                    name="message"
                    required
                    rows={4} 
                    class="w-full bg-transparent border-b-2 border-slate-200 py-3 focus:border-amber-500 outline-none transition-all font-black text-sm uppercase resize-none placeholder:text-slate-300 text-slate-950" 
                    placeholder="DESCRIBE THE SCOPE OF WORK..."
                  />
                </div>

                <div class="pt-6">
                  <Button 
                    type="submit"
                    disabled={submission.pending}
                    class="w-full bg-slate-950 text-white font-black uppercase tracking-[0.3em] py-8 rounded-none hover:bg-amber-600 transition-all flex items-center justify-center gap-4 disabled:opacity-70 group"
                  >
                    <Show when={submission.pending} fallback={
                      <>
                        <Send size={18} class="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                        <span>Send Project Brief</span>
                      </>
                    }>
                      <Loader2 size={18} class="animate-spin" /> <span>Processing...</span>
                    </Show>
                  </Button>
                  
                  <Show when={submission.result?.error}>
                    <div class="mt-4 flex items-center gap-2 text-red-600 bg-red-50 p-4 justify-center border border-red-100">
                      <AlertCircle size={16} />
                      <span class="text-[10px] font-black uppercase tracking-widest">{submission.result?.error}</span>
                    </div>
                  </Show>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHATSAPP FAST-TRACK */}
      <section class="bg-slate-950 py-24">
        <div class="container mx-auto px-6 text-center space-y-8">
          <MessageSquare size={40} class="mx-auto text-amber-500" />
          <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">Fast-Track Your Quote</h2>
          <p class="text-slate-400 max-w-lg mx-auto font-medium text-lg italic">
            "Direct communication leads to faster foundations."
          </p>
          <a href="https://wa.me/254727605092" target="_blank">
            <Button class="bg-amber-500 text-slate-950 font-black px-12 py-8 rounded-none hover:bg-white transition-all uppercase text-xs tracking-[0.2em]">
              Chat via WhatsApp
            </Button>
          </a>
        </div>
      </section>
      
      {/* 4. FOOTER */}
      <footer class="py-12 border-t border-slate-100 bg-white">
        <div class="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 bg-slate-950 text-white flex items-center justify-center font-black italic">B</div>
            <p class="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Brandflare Group Kenya &copy; {new Date().getFullYear()}</p>
          </div>
          <div class="flex gap-8 text-slate-400">
            <Instagram size={20} class="hover:text-amber-500 cursor-pointer transition-colors" />
            <Facebook size={20} class="hover:text-amber-500 cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
};

const ContactInfoItem: Component<{ icon: any, label: string, value: string, subtext: string }> = (props) => (
  <div class="group flex items-start gap-6">
    <div class="w-14 h-14 bg-slate-950 text-amber-500 flex items-center justify-center flex-shrink-0 transition-transform group-hover:-rotate-6 group-hover:bg-amber-500 group-hover:text-slate-950">
      <props.icon size={24} />
    </div>
    <div>
      <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{props.label}</h3>
      <p class="text-2xl font-black text-slate-950">{props.value}</p>
      <p class="text-sm text-slate-500 font-medium mt-1">{props.subtext}</p>
    </div>
  </div>
);

const FormInput: Component<{ name: string, label: string, placeholder: string, type?: string }> = (props) => (
  <div class="space-y-3">
    <label class="text-[10px] font-black uppercase tracking-widest text-slate-400">{props.label}</label>
    <input 
      name={props.name}
      required
      type={props.type || "text"}
      class="w-full bg-transparent border-b-2 border-slate-200 py-3 focus:border-amber-500 outline-none transition-all font-black text-sm uppercase placeholder:text-slate-300 text-slate-950" 
      placeholder={props.placeholder} 
    />
  </div>
);

export default ContactPage;