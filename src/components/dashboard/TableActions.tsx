import { Eye, Pencil, Trash2, ChevronDown } from "lucide-solid";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { TableCell } from "../ui/table";

interface ActionProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TableActions(props: ActionProps) {
  return (
    <TableCell class="text-right">
      <DropdownMenu>
        {/* We use the Button directly inside the trigger. 
            If hydration persists, removing 'as={Button}' and just using 
            a styled DropdownMenuTrigger is the next step. */}
        <DropdownMenuTrigger 
          as={Button} 
          variant="ghost" 
          size="icon" 
          class="h-8 w-8 rounded-md"
        >
          {ChevronDown({ size: 16 })}
        </DropdownMenuTrigger>
        
        <DropdownMenuContent class="min-w-[130px]">
          <DropdownMenuItem 
            onClick={() => props.onView()} 
            class="gap-2 cursor-pointer"
          >
            {Eye({ size: 14 })} 
            <span>View Details</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => props.onEdit()} 
            class="gap-2 cursor-pointer"
          >
            {Pencil({ size: 14 })} 
            <span>Edit</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => props.onDelete()} 
            class="gap-2 text-destructive focus:text-destructive cursor-pointer"
          >
            {Trash2({ size: 14 })} 
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  );
}