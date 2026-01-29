import { A } from "@solidjs/router";
import {
  LayoutDashboard,
  FileText,
  Users,
  Menu,
  Logs
} from "lucide-solid";
import { createSignal, For, type Component, Show, onMount } from "solid-js";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "~/components/ui/sheet";

const Navbar: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [isMounted, setIsMounted] = createSignal(false);

  onMount(() => {
    setIsMounted(true);
  });

  const navLinks = [
    { href: "/", label: "Home", icon: LayoutDashboard, exact: true },
    { href: "/gallery", label: "Gallery", icon: FileText, exact: false },
    { href: "/contact", label: "Contact", icon: Users, exact: false },
  ];

  return (
    <header class="sticky top-0 z-[100] w-full border-b bg-white/95 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
        
        {/* Left: Logo */}
        <div class="flex items-center">
          <A href="/" class="flex items-center">
            <img
              src="/logos/black.png"
              alt="Brandflare Logo"
              class="h-10 w-auto object-contain" 
            />
          </A>
        </div>

        {/* Center/Right: Desktop Links */}
        <nav class="hidden md:flex items-center gap-8">
          <For each={navLinks}>
            {(link) => (
              <A
                href={link.href}
                // 'end' ensures "/" is only active at exactly "/"
                end={link.exact}
                activeClass="text-slate-900 font-bold border-b-2 border-slate-900"
                inactiveClass="text-slate-500 hover:text-slate-900 transition-colors"
                class="py-5 px-1 transition-all"
              >
                <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                  <link.icon size={14} />
                  {link.label}
                </div>
              </A>
            )}
          </For>
        </nav>

        {/* Right: Mobile Trigger */}
        <div class="md:hidden flex items-center">
          <Show when={isMounted()}>
            <Sheet open={isOpen()} onOpenChange={setIsOpen}>
              <SheetTrigger>
                <Button variant="ghost" size="icon" class="hover:bg-slate-100">
                  <Menu class="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent position="left" class="w-[300px] bg-white border-r p-0">
                <div class="p-6">
                  <SheetHeader class="mb-8">
                    <SheetTitle class="flex items-center gap-2 text-left font-black tracking-tighter italic uppercase">
                      <Logs class="h-5 w-5" /> Brandflare
                    </SheetTitle>
                  </SheetHeader>
                  
                  <nav class="flex flex-col gap-1">
                    <For each={navLinks}>
                      {(link) => (
                        <A
                          href={link.href}
                          end={link.exact}
                          onClick={() => setIsOpen(false)}
                          activeClass="bg-slate-900 text-white"
                          inactiveClass="text-slate-600 hover:bg-slate-50"
                          class="flex items-center gap-4 p-4 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                          <link.icon size={18} /> 
                          {link.label}
                        </A>
                      )}
                    </For>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </Show>
        </div>

      </div>
    </header>
  );
};

export default Navbar;