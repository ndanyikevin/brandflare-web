import { JSX } from "solid-js";
import { Plus } from "lucide-solid";
import { Button } from "~/components/ui/button";

interface PageHeaderProps {
  title: string;
  description: string;
  buttonText: string;
  onAction?: () => void; // Function to run when button is clicked
  icon?: JSX.Element;    // Optional: in case you want a different icon than Plus
}

export function PageHeader(props: PageHeaderProps) {
  return (
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">{props.title}</h1>
        <p class="text-muted-foreground text-sm mt-1">{props.description}</p>
      </div>
      
      <Button 
        onClick={() => props.onAction?.()} 
        class="flex items-center gap-2 shadow-sm active:scale-95 transition-transform"
      >
        {/* REFACTORED: 
            1. We check for props.icon first.
            2. If missing, we call Plus() as a function.
        */}
        {props.icon || Plus({ size: 18 })}
        <span>{props.buttonText}</span>
      </Button>
    </div>
  );
}