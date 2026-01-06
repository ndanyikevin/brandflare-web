import { A } from "@solidjs/router";
import { Hammer, ArrowLeft, Home, Construction } from "lucide-solid";
import { Button } from "~/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div class="relative flex min-h-[75vh] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-muted-foreground/20 bg-card p-8">
      
      {/* Background Decorative Icon - Fixed size and opacity */}
      <div class="absolute flex items-center justify-center opacity-[0.02] pointer-events-none">
        <Construction size={280} />
      </div>

      {/* Content Container - Relative z-index to stay above the icon */}
      <div class="relative z-10 flex flex-col items-center text-center">
        
        {/* Animated Icon Circle */}
        <div class="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 mb-8 border border-primary/20">
          <Hammer class="h-12 w-12 text-primary animate-pulse" />
        </div>

        {/* Text Section */}
        <div class="max-w-md space-y-4">
          <h1 class="text-7xl font-black tracking-tighter text-foreground/90">
            404
          </h1>
          <h2 class="text-3xl font-bold text-foreground">
            Workshop Area Restricted
          </h2>
          <p class="text-muted-foreground text-lg leading-relaxed">
            We couldn't find the page you're looking for. It might have been moved, deleted, or hasn't been built yet.
          </p>
        </div>

        {/* Buttons */}
        <div class="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.history.back()}
            class="px-8"
          >
            <ArrowLeft class="mr-2 h-4 w-4" />
            Go Back
          </Button>
          
          <A href="/dashboard">
            <Button size="lg" class="px-8">
              <Home class="mr-2 h-4 w-4" />
              Overview
            </Button>
          </A>
        </div>

        {/* Small Footer Text */}
        <p class="mt-16 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground/40">
          Error Log: PAGE_NOT_IN_BLUEPRINT
        </p>
      </div>
    </div>
  );
}