import { TriangleAlert, RefreshCcw } from "lucide-solid";
import { Show } from "solid-js";
import { Button } from "~/components/ui/button";

/**
 * DataError Component
 * Refactored for Brandflare Woodworks to ensure 100% hydration compatibility.
 */
export default function DataError(props: { error: any; reset: () => void }) {
  return (
    <div class="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed rounded-xl bg-destructive/5 border-destructive/10">
      <div class="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        {/* REFACTORED: Icon called as function to prevent template2 error */}
        {TriangleAlert({ class: "text-destructive h-6 w-6" })}
      </div>
      
      <h3 class="text-lg font-semibold text-foreground">Connection Issue</h3>
      
      <p class="text-sm text-muted-foreground mt-2 max-w-[300px] text-center">
        We couldn't reach the workshop records. Please check if the server is running on port 5000.
      </p>
      
      <Button 
        variant="outline" 
        size="sm" 
        // Direct reference to the reset function
        onClick={props.reset} 
        class="mt-6 flex items-center gap-2"
      >
        {/* REFACTORED: Icon called as function */}
        {RefreshCcw({ class: "h-4 w-4" })}
        Retry Connection
      </Button>

      {/* Developer helper - hidden in production if needed */}
      <Show when={props.error}>
        <pre class="mt-4 text-[10px] text-destructive/50 max-w-full overflow-x-auto">
          {JSON.stringify(props.error?.message || props.error, null, 2)}
        </pre>
      </Show>
    </div>
  );
}