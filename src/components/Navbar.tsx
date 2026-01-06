import { A, useNavigate } from "@solidjs/router";
import { useColorMode } from "@kobalte/core";
import { 
  Sun, Moon, LayoutDashboard, FileText, 
  Users, Settings, Menu, Logs, LogOut, LogIn 
} from "lucide-solid";
import { Button } from "~/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetHeader, 
  SheetTitle 
} from "~/components/ui/sheet";
import { createSignal, Show, For, createResource } from "solid-js";
import { API_BASE_URL } from "~/lib/api";

export default function Navbar() {
  const [isOpen, setIsOpen] = createSignal(false);
  const navigate = useNavigate();

  // 1. Fetch User Session
  const [user, { mutate }] = createResource(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        credentials: "include",
      });
      if (res.status === 401) return null;
      if (!res.ok) return null;
      const data = await res.json();
      return data.user; 
    } catch (err) {
      return null;
    }
  });

  // 2. Logout Handler
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { 
        method: "POST", 
        credentials: "include" 
      });
      mutate(null); 
      setIsOpen(false);
      navigate("/sign-in", { replace: true });
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  // 3. Navigation Links
  const navLinks = () => [
    { href: "/", label: "Home", icon: LayoutDashboard, public: true },
    { href: "/gallery", label: "Gallery", icon: FileText, public: true },
    { href: "/contact", label: "Contact", icon: Users, public: true },
    { href: "/dashboard", label: "Dashboard", icon: Settings, public: false },
  ].filter(link => link.public || !!user());

  return (
    <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-16 items-center justify-between px-4 mx-auto">
        
        {/* Logo Section - REFACTORED */}
        <A href="/" class="flex items-center gap-2">
          {Logs({ class: "h-6 w-6 text-primary" })}
          <span class="text-xl font-bold tracking-tight hidden md:inline-block">
            Brandflare <span class="text-primary text-sm font-normal">Woodworks</span>
          </span>
        </A>

        {/* Desktop Navigation */}
        <nav class="hidden md:flex items-center gap-6">
          <For each={navLinks()}>
            {(link) => (
              <A 
                href={link.href} 
                activeClass="text-primary font-semibold"
                inactiveClass="text-muted-foreground transition-colors hover:text-primary"
                end={link.href === "/"}
              >
                <div class="flex items-center gap-2 text-sm">
                  {/* REFACTORED */}
                  {link.icon({ size: 18 })}
                  {link.label}
                </div>
              </A>
            )}
          </For>
        </nav>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            
            {/* Desktop Auth Section */}
            <Show when={!user.loading}>
              <Show 
                when={user()} 
                fallback={
                  <Button as={A} href="/sign-in" variant="default" size="sm" class="hidden md:flex gap-2">
                    {LogIn({ size: 16 })} Sign In
                  </Button>
                }
              >
                <div class="hidden md:flex items-center gap-3">
                   <div class="flex flex-col items-end leading-none">
                      <span class="text-xs font-bold capitalize">{user()?.username}</span>
                      <span class="text-[10px] text-muted-foreground uppercase">{user()?.role}</span>
                   </div>
                   <Button onClick={handleLogout} variant="outline" size="sm" class="gap-2 text-red-500 hover:text-red-600">
                    {LogOut({ size: 16 })} Log Out
                  </Button>
                </div>
              </Show>
            </Show>

            {/* Mobile Navigation */}
            <div class="md:hidden">
              <Sheet open={isOpen()} onOpenChange={setIsOpen}>
                <SheetTrigger as={Button} variant="ghost" size="icon">
                  {/* REFACTORED */}
                  {Menu({ class: "h-6 w-6" })}
                </SheetTrigger>
                <SheetContent position="left">
                  <SheetHeader>
                    <SheetTitle class="text-left flex items-center gap-2">
                      {Logs({ class: "h-5 w-5 text-primary" })}
                      Brandflare
                    </SheetTitle>
                  </SheetHeader>
                  <div class="grid gap-4 py-8">
                    <For each={navLinks()}>
                      {(link) => (
                        <A 
                          href={link.href} 
                          onClick={() => setIsOpen(false)}
                          class="flex items-center gap-4 text-lg font-medium text-muted-foreground hover:text-primary"
                        >
                          {link.icon({ size: 20 })}
                          {link.label}
                        </A>
                      )}
                    </For>
                    
                    <hr class="my-2 border-muted" />

                    <Show when={!user.loading}>
                      <Show 
                        when={user()} 
                        fallback={
                          <Button as={A} href="/sign-in" onClick={() => setIsOpen(false)} class="w-full gap-2">
                            {LogIn({ size: 18 })} Sign In
                          </Button>
                        }
                      >
                        <div class="flex flex-col gap-4">
                          <div class="px-2">
                            <p class="text-sm font-semibold capitalize">{user()?.username}</p>
                            <p class="text-xs text-muted-foreground uppercase">{user()?.role}</p>
                          </div>
                          <Button onClick={handleLogout} variant="destructive" class="w-full gap-2">
                            {LogOut({ size: 18 })} Log Out
                          </Button>
                        </div>
                      </Show>
                    </Show>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}