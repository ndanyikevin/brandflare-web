import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { A } from "@solidjs/router";
import { Hammer, Home, Construction } from "lucide-solid";
import { Button } from "~/components/ui/button";
import { clientOnly } from "@solidjs/start";

// We wrap the icon section to ensure it only renders on the client
// if the hydration mismatch persists.
export default function NotFound() {
  return (
    <main class="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <Title>404 - Page Not Found | Brandflare Woodworks</Title>
      <HttpStatusCode code={404} />

      <div class="relative mb-8 flex items-center justify-center">
        {/* Background Icon - Called as function */}
        <div class="absolute opacity-10 rotate-12 -z-10">
          {Construction({ size: 120 })}
        </div>
        
        {/* Main Icon Container */}
        <div class="bg-primary/10 p-6 rounded-full text-primary">
          {Hammer({ size: 64 })}
        </div>
      </div>

      <h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        Measure Twice, <span class="text-primary">Cut Once.</span>
      </h1>
      
      <p class="text-xl text-muted-foreground max-w-[500px] mb-8">
        Oops! It looks like this piece of the site hasn't been carved out yet.
      </p>

      <div class="flex flex-col sm:flex-row gap-4">
        {/* Use a regular div if Button + A causes nesting issues in your UI library */}
        <A href="/">
          <Button variant="default" class="gap-2 px-8 w-full">
            {Home({ size: 18 })}
            Back to Workshop
          </Button>
        </A>
        
        <A href="/contact">
          <Button variant="outline" class="w-full">
            Report an Issue
          </Button>
        </A>
      </div>

      <div class="mt-16 border-t border-dashed border-muted w-full max-w-md pt-8">
        <p class="text-sm text-muted-foreground italic">
          "Quality woodworking takes time. Finding pages shouldn't."
        </p>
      </div>
    </main>
  );
}