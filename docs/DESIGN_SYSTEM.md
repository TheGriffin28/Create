# UI/UX Design System Specification: Create
*Authored by Nova — UI/UX & Creative Designer, Nexora AI Office*

## 1. Visual Theme & Philosophy
- **Theme:** Ultra-modern Dark Mode with refined glassmorphism and high contrast.
- **Rhythm:** 8pt grid spacing system (`p-2`, `p-4`, `p-6`, `gap-4`).

## 2. Curated Color Palette
| Token | Hex Value | Role |
|---|---|---|
| `background` | `#0B0F17` | Deep application canvas |
| `card` | `#111827` | Elevated surface containers |
| `cardBorder` | `#1F2937` | Subtle definition outlines |
| `accent` | `#3B82F6` | Primary interactive highlights |
| `textPrimary` | `#F9FAFB` | High-contrast readability |

## 3. Core Component Layout Hierarchy
1. **Header & Brand Navbar**
2. **KPI Metrics Dashboard**
3. **Filter & Search Toolbar**
4. **Responsive Data Grid / Table**
5. **Create / Edit Drawer Modal**
6. **Status & Priority Pill Badges**

## 4. UI Implementation Rules for Forge
- Use Tailwind utility classes matching the tokens above.
- Ensure all interactive elements have responsive focus and hover transition states (`transition-all duration-150`).
- Render status tags using pill badges with semitransparent backgrounds (e.g. `bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`).
