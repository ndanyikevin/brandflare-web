import { A, useNavigate, createAsync, revalidate } from "@solidjs/router";
import {
  LayoutDashboard, FileText, Users, Settings,
  Menu, Logs, LogOut, LogIn
} from "lucide-solid";
import { createSignal, Show, For, Suspense, type Component } from "solid-js";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "~/components/ui/sheet";
import { getUsers } from "~/lib/user";
import { API_BASE_URL } from "~/lib/api";

const Navbar: Component = () => {
  const [isOpen, setIsOpen] = createSignal(false);
  const navigate = useNavigate();


  const navLinks = [
    { href: "/", label: "Home", icon: LayoutDashboard, public: true },
    { href: "/gallery", label: "Gallery", icon: FileText, public: true },
    { href: "/contact", label: "Contact", icon: Users, public: true },
  ];

  // const visibleLinks = () => navLinks.filter(l => l.public || !!user());

  return (
    <header class="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm">
      <div class="container flex h-16 items-center justify-between px-4 mx-auto">

        <A href="/" class="flex items-center gap-2">
          <img
            src="/logos/black.png"
            alt="Brandflare Logo"
            class="h-12 w-120 object-contain"
          />
        </A>

        <nav class="hidden md:flex items-center gap-6">
          <For each={navLinks}>
            {(link) => (
              <A
                href={link.href}
                activeClass="text-slate-900 font-bold border-b-2 border-slate-900"
                inactiveClass="text-slate-500 hover:text-slate-900 transition-colors"
                end={link.href === "/"}
                class="py-1 px-1"
              >
                <div class="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                  <link.icon size={16} />
                  {link.label}
                </div>
              </A>
            )}
          </For>
        </nav>

        {/* <div class="flex items-center gap-4">
          <Suspense fallback={<div class="w-20 h-8 bg-slate-100 animate-pulse rounded-lg" />}>
            <Show 
              when={user()} 
              fallback={
                <A href="/sign-in" class="hidden md:block">
                  <Button variant="outline" size="sm" class="font-bold uppercase tracking-tighter">
                    Operator Login
                  </Button>
                </A>
              }
            >
              <div class="hidden md:flex items-center gap-4">
                <div class="text-right">
                  <p class="text-[9px] font-black text-slate-400 uppercase leading-none">Identity</p>
                  <p class="text-xs font-bold text-slate-900 leading-none mt-1">{user()?.username}</p>
                </div>
                <Button onClick={handleLogout} variant="ghost" size="icon" class="text-red-500 hover:bg-red-50">
                  <LogOut size={18} />
                </Button>
              </div>
            </Show>
          </Suspense>

          <div class="md:hidden">
            <Sheet open={isOpen()} onOpenChange={setIsOpen}>
              <SheetTrigger>
                <Button variant="ghost" size="icon"><Menu class="h-6 w-6" /></Button>
              </SheetTrigger>
              <SheetContent position="left" class="w-full sm:w-[350px] bg-white border-r p-6">
                <SheetHeader class="mb-8">
                  <SheetTitle class="flex items-center gap-2 text-left font-black tracking-tighter italic uppercase">
                    <Logs class="h-5 w-5" /> Brandflare
                  </SheetTitle>
                </SheetHeader>
                <div class="flex flex-col gap-2">
                  <For each={visibleLinks()}>
                    {(link) => (
                      <A 
                        href={link.href} 
                        onClick={() => setIsOpen(false)} 
                        class="flex items-center gap-4 p-4 rounded-xl text-sm font-bold uppercase tracking-widest border border-transparent active:bg-slate-50 hover:bg-slate-50"
                      >
                        <link.icon size={20} /> {link.label}
                      </A>
                    )}
                  </For>
                  
                  <Show when={user()}>
                    <div class="mt-8 pt-8 border-t border-slate-100">
                       <Button onClick={handleLogout} variant="destructive" class="w-full py-6 font-bold uppercase tracking-widest">
                         Terminate Session
                       </Button>
                    </div>
                  </Show>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div> */}
      </div>
    </header>
  );
}

export default Navbar;