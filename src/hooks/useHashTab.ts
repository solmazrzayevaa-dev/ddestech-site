"use client";

import { useSyncExternalStore } from "react";
import { aiCreator } from "@/content/site";

/**
 * `#ai-creator` / `#ai-creator-qeydiyyat` hash-ini oxuyur ki, modal
 * birbaşa linklə açıla bilsin (məs. Instagram bio-dan qeydiyyata).
 *
 * `useSyncExternalStore` işlədilir, `useEffect` + `setState` yox: serverdə
 * snapshot `null` olur, brauzerdə real hash — hidrasiya uyğunsuzluğu
 * yaranmır və effekt içində state dəyişdirmək lazım gəlmir.
 */

export type AiCreatorTab = "program" | "register";

function subscribe(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function getSnapshot(): AiCreatorTab | null {
  if (window.location.hash === aiCreator.hashProgram) return "program";
  if (window.location.hash === aiCreator.hashRegister) return "register";
  return null;
}

/** Serverdə hash yoxdur. */
function getServerSnapshot(): AiCreatorTab | null {
  return null;
}

export function useHashTab(): AiCreatorTab | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
