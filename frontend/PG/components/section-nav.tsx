"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface SectionNavItem {
  id: string;
  label: string;
}

interface SectionNavProps {
  sections: SectionNavItem[];
  className?: string;
}

export function SectionNav({ sections, className }: SectionNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Walk up the DOM to find the actual scrollable container (the <main> in our layout).
    // The layout uses `overflow-y-auto` on <main>, so window never scrolls.
    function getScrollContainer(el: HTMLElement | null): HTMLElement | null {
      let node = el?.parentElement ?? null;
      while (node && node !== document.documentElement) {
        const { overflowY } = window.getComputedStyle(node);
        if (overflowY === "auto" || overflowY === "scroll") {
          return node;
        }
        node = node.parentElement;
      }
      return null;
    }

    const scrollContainer = getScrollContainer(navRef.current);

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const callback: IntersectionObserverCallback = (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.15)
        .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);

      if (visibleEntries.length > 0) {
        setActiveId(visibleEntries[0].target.id);
      }
    };

    observerRef.current = new IntersectionObserver(callback, {
      // Pass the scroll container as root so intersection is computed
      // relative to the scrollable <main>, not the full browser viewport.
      root: scrollContainer ?? null,
      rootMargin: "-10% 0px -55% 0px",
      threshold: [0.15],
    });

    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sections]);

  function scrollToSection(id: string): void {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }
    // scrollIntoView respects the actual scroll container, not window
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  }

  return (
    <nav
      ref={navRef}
      className={cn(
        "sticky top-0 z-30 flex items-center gap-1 px-6 h-10",
        "bg-background/95 backdrop-blur-sm border-b border-border",
        className
      )}
      aria-label="Page sections"
    >
      {sections.map(({ id, label }) => {
        const isActive = activeId === id;
        return (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={cn(
              "px-3 py-1 rounded-md text-xs font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
