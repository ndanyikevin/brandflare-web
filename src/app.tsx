import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense,} from "solid-js";
import {
  ColorModeProvider,
  ColorModeScript,
  createLocalStorageManager
} from "@kobalte/core";
import { isServer } from "solid-js/web";

import "./app.css";
import Navbar from "./components/Navbar";
import "@fontsource/inter";

export default function App() {
  // Use local storage manager for theme persistence
  const storageManager = createLocalStorageManager("kb-theme");

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          {/* CRITICAL: ColorModeScript handles the 'pre-hydration' theme application 
             to prevent the white-flash on page load. 
          */}
          <ColorModeScript storageType={storageManager.type} />
          
          <ColorModeProvider storageManager={storageManager}>
            <Title>Brandflare | Industrial Systems</Title>
            
            <div class="min-h-screen bg-background text-foreground transition-colors duration-300">
              {/* The Navbar is often dependent on client-side state (Auth/LocalStorage).
                 If it causes issues, you can wrap it in a <Show when={!isServer}> 
                 or ensure it has a stable 'loading' state.
              */}
              <Navbar />
              
              <main class="container mx-auto p-4 md:p-8">
                <Suspense fallback={
                  <div class="flex items-center justify-center h-[50vh]">
                    <div class="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                }>
                  {props.children}
                </Suspense>
              </main>
            </div>
          </ColorModeProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}