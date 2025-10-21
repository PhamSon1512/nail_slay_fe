# Figma to Code Guide

## Quick Start
```bash
# When working with Figma designs:
1. Get Figma URL/node-id
2. Use Figma MCP to fetch design
3. Follow this guide for implementation
```

## Stack
React 19 + React Router v7 + TypeScript + Tailwind v4 + HeroUI + Framer Motion + Valtio + xior

## Key Principles
1. **100% Accuracy**: Extract exact values from Figma (colors, spacing, typography)
2. **Component Pattern**: Use HeroUI base + Tailwind + Framer Motion
3. **State**: Valtio (proxy-based reactive)
4. **HTTP**: xior client
5. **Responsive**: Mobile-first (< 768px, 768-1024px, ≥ 1024px)

## Template
```typescript
import { cn } from "~/lib/utils";
import { motion } from "framer-motion";

export function Component({ className, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-4 px-6 py-4",
        "bg-white rounded-lg shadow-lg",
        "hover:shadow-xl transition-all duration-300",
        "md:px-8 lg:gap-8", // Responsive
        className
      )}
    >
      {/* Match Figma design exactly */}
    </motion.div>
  );
}
```

## Utils
```typescript
// ~/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs) => twMerge(clsx(inputs));
```

## Checklist
- [ ] Colors exact (hex from Figma)
- [ ] Typography match (font, size, weight, line-height)
- [ ] Spacing precise (px values)
- [ ] Responsive tested (all breakpoints)
- [ ] Animations smooth
- [ ] Accessibility (keyboard, ARIA, contrast)

See `.clinerules` for complete guide.
