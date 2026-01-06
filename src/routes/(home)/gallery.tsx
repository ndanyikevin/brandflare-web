import { createSignal, For } from "solid-js";
import { 
  MapPin, ArrowUpRight, Filter, 
  Maximize2
} from "lucide-solid";
import { Button } from "~/components/ui/button";

export default function GalleryPage() {
  const [filter, setFilter] = createSignal("All");

  const projects = [
    { 
      id: 1, 
      title: "Contemporary Shell & Core", 
      location: "Karen, Nairobi", 
      category: "Construction",
      img: "https://images.unsplash.com/photo-1590373930843-0597d3969185?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      id: 2, 
      title: "Tray Ceiling with LED Coves", 
      location: "Runda", 
      category: "Gypsum",
      img: "https://images.unsplash.com/photo-1615873968403-89e068629275?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      id: 3, 
      title: "Executive Office Fit-out", 
      location: "Upper Hill", 
      category: "Finishing",
      img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      id: 4, 
      title: "Modern 4-Bedroom Villa", 
      location: "Kiambu Road", 
      category: "Construction",
      img: "https://images.unsplash.com/photo-1600585154340-be6191dae10c?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      id: 5, 
      title: "Bulkhead Gypsum Design", 
      location: "Westlands", 
      category: "Gypsum",
      img: "https://images.unsplash.com/photo-1620626011761-9963d7521476?auto=format&fit=crop&q=80&w=800" 
    },
    { 
      id: 6, 
      title: "Bespoke Wardrobe Installation", 
      location: "Kilimani", 
      category: "Finishing",
      img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800" 
    }
  ];

  const categories = ["All", "Construction", "Gypsum", "Finishing"];

  const filteredProjects = () => 
    filter() === "All" ? projects : projects.filter(p => p.category === filter());

  return (
    <div class="bg-white min-h-screen">
      {/* 1. MINIMALIST HEADER */}
      <section class="pt-32 pb-20 border-b border-slate-100">
        <div class="container mx-auto px-6">
          <div class="max-w-4xl">
            <h1 class="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
              Selected <br/> <span class="text-amber-500">Works.</span>
            </h1>
            <p class="text-slate-500 text-lg md:text-xl font-medium max-w-xl uppercase tracking-tight">
              A curated showcase of our engineering precision and interior artistry.
            </p>
          </div>
        </div>
      </section>

      {/* 2. FILTER NAVIGATION */}
      <div class="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div class="container mx-auto px-6 py-6 flex overflow-x-auto gap-8 items-center no-scrollbar">
          <div class="flex items-center gap-2 text-slate-400 mr-4">
            {Filter({ size: 16 })}
            <span class="text-[10px] font-black uppercase tracking-widest">Filter</span>
          </div>
          <For each={categories}>
            {(cat) => (
              <button 
                onClick={() => setFilter(cat)}
                class="text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap"
                classList={{
                  'text-amber-600 border-b-2 border-amber-600 pb-1': filter() === cat,
                  'text-slate-400 hover:text-slate-900': filter() !== cat
                }}
              >
                {cat}
              </button>
            )}
          </For>
        </div>
      </div>

      {/* 3. MASONRY GRID */}
      <section class="py-20 container mx-auto px-6">
        <div class="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          <For each={filteredProjects()}>
            {(project) => (
              <div class="break-inside-avoid group relative bg-slate-100 overflow-hidden cursor-pointer">
                {/* Image Component */}
                <div class="relative overflow-hidden">
                  <img 
                    src={project.img} 
                    alt={project.title}
                    loading="lazy"
                    class="w-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-in-out"
                  />
                  {/* Overlay on Hover */}
                  <div class="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-all duration-500 flex items-center justify-center">
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0 text-white text-center p-6">
                      {Maximize2({ size: 32, class: "mx-auto mb-4 text-amber-500" })}
                      <p class="text-[10px] font-black uppercase tracking-[0.3em]">View Case Study</p>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div class="py-6 space-y-2">
                  <div class="flex justify-between items-start">
                    <h3 class="text-xl font-black uppercase tracking-tighter leading-tight max-w-[80%]">
                      {project.title}
                    </h3>
                    <div class="text-amber-600">
                      {ArrowUpRight({ size: 20 })}
                    </div>
                  </div>
                  <div class="flex items-center gap-4 text-slate-400">
                    <div class="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                      {MapPin({ size: 12, class: "text-amber-500" })} {project.location}
                    </div>
                    <div class="w-1 h-1 bg-slate-200 rounded-full"></div>
                    <div class="text-[10px] font-black uppercase tracking-widest">
                      {project.category}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section class="bg-slate-950 py-32 text-center text-white">
        <div class="container mx-auto px-6">
          <h2 class="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
            Your Project <br/> <span class="text-amber-500 text-6xl md:text-8xl">Starts Here.</span>
          </h2>
          <Button class="bg-white text-slate-950 font-black px-12 py-8 rounded-none hover:bg-amber-500 transition-colors uppercase text-xs tracking-[0.2em]">
            Inquire About Your Project
          </Button>
        </div>
      </section>

      {/* 5. MINIMAL FOOTER */}
      <footer class="py-12 border-t border-slate-100">
        <div class="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div class="flex items-center gap-2">
             <div class="w-10 h-10 bg-slate-950 text-white flex items-center justify-center font-black">B</div>
             <p class="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Brandflare Group</p>
          </div>
          <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest">© 2025 Engineering Excellence</p>
        </div>
      </footer>
    </div>
  );
}