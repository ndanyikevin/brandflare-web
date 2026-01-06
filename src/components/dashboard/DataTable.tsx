import { For, Suspense, ErrorBoundary, JSX, Resource, createSignal, createMemo, Show } from "solid-js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { ChevronUp, ChevronDown, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-solid";
import DataError from "~/components/dashboard/DataError";

interface ColumnConfig {
  label: string;
  sortKey?: string;
}

interface DataTableProps<T> {
  data: Resource<T[] | undefined>;
  columns: ColumnConfig[];
  refetch: () => void;
  renderRow: (item: T) => JSX.Element;
  loadingMessage?: string;
  emptyMessage?: string;
  itemsPerPage?: number;
}

export function DataTable<T>(props: DataTableProps<T>) {
  const [sort, setSort] = createSignal<{ key: string; dir: 'asc' | 'desc' } | null>(null);
  const [page, setPage] = createSignal(1);
  const itemsPerPage = props.itemsPerPage || 10;

  const processedData = createMemo(() => {
    const raw = props.data();
    if (!raw) return [];

    let result = [...raw];

    const s = sort();
    if (s) {
      result.sort((a: any, b: any) => {
        const aVal = a[s.key];
        const bVal = b[s.key];
        if (aVal < bVal) return s.dir === 'asc' ? -1 : 1;
        if (aVal > bVal) return s.dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    const start = (page() - 1) * itemsPerPage;
    return result.slice(start, start + itemsPerPage);
  });

  const totalPages = () => Math.ceil((props.data()?.length || 0) / itemsPerPage);

  const handleSort = (key?: string) => {
    if (!key) return;
    setSort(prev => {
      if (prev?.key === key) {
        return prev.dir === 'asc' ? { key, dir: 'desc' } : null;
      }
      return { key, dir: 'asc' };
    });
    setPage(1);
  };

  return (
    <div class="space-y-4">
      <div class="rounded-xl border bg-card shadow-sm overflow-hidden">
        <ErrorBoundary fallback={(err, reset) => (
          <div class="p-4">
            <DataError error={err} reset={() => { reset(); props.refetch(); }} />
          </div>
        )}>
          <Suspense fallback={
            <div class="p-20 text-center animate-pulse text-muted-foreground">
              {props.loadingMessage || "Loading workshop records..."}
            </div>
          }>
            <div class="w-full overflow-auto">
              <Table>
                <TableHeader class="bg-muted/50">
                  <TableRow>
                    <For each={props.columns}>
                      {(col) => (
                        <TableHead 
                          onClick={() => handleSort(col.sortKey)}
                          class={col.sortKey ? "cursor-pointer select-none hover:bg-muted/80 transition-colors" : ""}
                        >
                          <div class="flex items-center gap-2">
                            {col.label}
                            <Show when={col.sortKey}>
                              <span class="text-muted-foreground">
                                {sort()?.key === col.sortKey ? (
                                  sort()?.dir === 'asc' 
                                    ? ChevronUp({ size: 14 }) 
                                    : ChevronDown({ size: 14 })
                                ) : (
                                  ArrowUpDown({ size: 14, class: "opacity-30" })
                                )}
                              </span>
                            </Show>
                          </div>
                        </TableHead>
                      )}
                    </For>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <For 
                    each={processedData()} 
                    fallback={
                      <TableRow>
                        <TableCell colSpan={props.columns.length} class="h-32 text-center text-muted-foreground">
                          {props.data.loading ? "Synchronizing..." : (props.emptyMessage || "No records found.")}
                        </TableCell>
                      </TableRow>
                    }
                  >
                    {(item) => props.renderRow(item)}
                  </For>
                </TableBody>
              </Table>
            </div>
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* Pagination Footer - Added Show for data availability to prevent hydration mismatch */}
      <Show when={!props.data.loading && (props.data()?.length || 0) > itemsPerPage}>
        <div class="flex items-center justify-between px-2 py-2">
          <div class="text-sm text-muted-foreground">
            Showing <strong>{processedData().length}</strong> of <strong>{props.data()?.length}</strong> results
          </div>
          <div class="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page() === 1}
              onClick={() => setPage(p => p - 1)}
              class="gap-1"
            >
              {ChevronLeft({ size: 16 })} Previous
            </Button>
            <div class="text-sm font-medium px-4 min-w-[80px] text-center">
              {page()} / {totalPages()}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page() === totalPages()}
              onClick={() => setPage(p => p + 1)}
              class="gap-1"
            >
              Next {ChevronRight({ size: 16 })}
            </Button>
          </div>
        </div>
      </Show>
    </div>
  );
}