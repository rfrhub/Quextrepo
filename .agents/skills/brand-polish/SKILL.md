---
name: brand-polish
description: Refines, aligns, and polishes frontend UI layouts while strictly preserving existing fonts, typography hierarchies, and core brand color guidelines.
---

# Brand Polish & UI Refinement Skill

## When to use this skill
- When requested to "polish", "clean up", "refine", or "fix layout inconsistencies" on an existing site.
- When micro-interactions, spacing, or visual polish need improvement without changing the established brand look.

## Core Rules (What to PROTECT)
1. ❌ DO NOT change the existing font family declarations, font weights, or typography mappings. 
2. ❌ DO NOT alter core brand identity tokens (primary, secondary, and background colors) unless fixing low contrast issues.
3. ❌ DO NOT refactor structural layouts into standard generic AI design structures.

## Polishing Checklist (What to IMPROVE)
1. **The "Anti-Slop" Spacing Rule:** Audit padding and margins. Ensure consistent mathematical spacing scales (e.g., matching 4px/8px multiples or Tailwind scales) across components.
2. **Visual Hierarchy Alignment:** Tighten the alignment of icons, labels, and input fields. Ensure perfect grid tracks and flex alignment.
3. **Micro-interactions:** Add smooth, tactile hover states (`transition-all duration-200 ease-in-out`), subtle scale resets on button active states, and focus-ring states for inputs.
4. **Borders & Radii:** Standardize container border-radius tracking (ensure inner containers have smaller radius scales than outer wrapper containers for nesting harmony).
5. **Contrast & Details:** Refine placeholder colors, thin out dividers with low-opacity variants (e.g., `border-slate-200/50`), and apply subtle backdrop-blurs if contextual headers overlap scrolling components.

## Execution Workflow
1. Read the existing layout styles and document the exact font families and CSS variables currently active.
2. Formulate a list of micro-refinement edits (spacing, alignments, micro-interactions).
3. Apply changes iteratively, keeping the original markup intact.
