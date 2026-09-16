# Microsoft Foundry — Interactive Reference Architecture

An interactive, exploded isometric model of Microsoft Foundry as an enterprise AI
reference architecture. Six floating platforms — from Azure infrastructure up to
production AI experiences — that can be explored layer by layer or played as a
guided story for a customer presentation.

Built as a static single-page app: no backend, no authentication, no database,
no external APIs.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

Production build and local preview:

```bash
npm run build    # type-checks, then emits ./dist
npm run preview
```

`npm run typecheck` runs the TypeScript pass on its own.

The contents of `dist/` are fully static and can be dropped onto any static host
(Azure Static Web Apps, Storage static website, GitHub Pages). `vite.config.ts`
sets `base: './'` so it also works from a subdirectory.

---

## The architecture stack

| Step | Layer | Purpose |
| --- | --- | --- |
| 06 | AI Experiences | Deliver governed agents where people already work |
| 05 | Microsoft Foundry Agent Service | Build, orchestrate and operate agents (hero layer) |
| 04 | Models & Knowledge | Foundry Models + Foundry IQ |
| 03 | Quality & Operations | Evaluate, observe, improve |
| 02 | Governance & Control Plane | Identity, policy, security, compliance |
| 01 | Azure Foundation | Compute, storage, network, secrets, monitoring |

Four relationship types are drawn across the layers:

- **Request and control** — solid charcoal
- **Knowledge and data** — dashed blue
- **Telemetry** — dotted cyan
- **Policy and governance** — purple

Every line has an arrowhead and a short verb label. At rest the diagram shows
only the **numbered primary path** — ① Request → ② Call model → ③ Ground with
context → ④ Trace & evaluate, plus the governance marker. Those five routes
deliberately connect *adjacent* layers only, so each one stays short and near
vertical rather than sweeping across the whole stack.

Selecting a layer swaps in the relationships that touch it. Clicking a type in
the legend isolates that type across the whole architecture.

---

## Interaction

| Action | Result |
| --- | --- |
| Hover a platform | Slight lift, stronger shadow, component labels fade in |
| Click / `Enter` / `Space` | Selects the layer, opens details, x-rays the layers above |
| Click a legend entry | Isolates that flow type across the architecture |
| `Esc` | Clears selection and returns to the full architecture |
| `↑` / `↓` | Moves focus between platforms |
| `P` | Presentation mode (chrome hidden, larger headline) |
| `F` | Fullscreen |
| `←` / `→` | Step through the story while presenting |

**Play architecture** runs the seven-step sequence (Foundation → Govern →
Operate → Intelligence → Agents → Experiences → Complete), holding slightly
longer on the Agent Service reveal. Playback never starts automatically.

---

## Project structure

```
src/
  App.tsx                     Page shell, global keyboard shortcuts
  main.tsx                    React entry point
  styles.css                  Design tokens + all component styles
  lib/
    iso.ts                    Isometric projection maths (single source of truth)
  hooks/
    useArchitectureStory.ts   Story, selection and presentation state
    useViewport.ts            Fit-to-stage scaling + media queries
  data/
    architecture.ts           Layers, modules, captions, capabilities
    flows.ts                  Cross-layer relationships
    assets.ts                 Product logo asset map
  components/
    ArchitectureScene.tsx     Perspective container, scaling, keyboard nav
    ArchitectureLayer.tsx     One isometric platform, its pedestals and icon pins
    ModuleIcon.tsx            Glyph registry + official logo override
    PlateArt.tsx              In-plane SVG (grids, rails, telemetry lanes)
    FlowLines.tsx             SVG overlay for cross-layer flows
    LayerDetails.tsx          Right-hand detail panel
    StoryNavigator.tsx        Step navigation
    Controls.tsx              Play / pause / previous / next / reset
    Header.tsx                Brand and primary actions
    Legend.tsx                Flow line key
```

### How the isometric scene works

There is no 3D engine. `.stack` applies `rotateX(66deg) rotateZ(-28deg)` inside a
CSS `perspective` container, and each platform is lifted with `translateZ`.
Slab thickness comes from two child faces hinged with `rotateX(-90deg)` and
`rotateY(-90deg)`, so every element stays real DOM — text remains selectable and
crisp, and the whole scene is screen-reader accessible.

`src/lib/iso.ts` replicates that same transform chain in TypeScript. The SVG flow
overlay projects its endpoints through `project()`, which is why connectors land
exactly on the CSS-transformed geometry at any scale. **If you change `ROT_X`,
`ROT_Z`, `PLANE_W`, `PLANE_H` or `LAYER_GAP`, update the matching values in
`styles.css` (`--plane-w`, `--plane-h`, and the `.stack` transform).**

Labels that must face the viewer use `BILLBOARD_TRANSFORM`, the exact inverse of
the stack rotation.

`useFitScale` measures the stage and scales the nominal design box so the whole
assembly always fits the first viewport without scrolling.

---

## Editing the content

All copy and geometry live in `src/data/` — no content is hardcoded in JSX.

- **Add a capability or change wording:** edit the layer entry in
  `src/data/architecture.ts`.
- **Move or add a module:** add an `ArchitectureModule`. `position` is a
  percentage of the plane surface, `size`/`height` are plane-space pixels, and
  `kind` selects the shape treatment (`block`, `tower`, `node`, `hub`, `gate`,
  `shield`, `gauge`, `cube`, `panel`, `device`). Give it an `icon` key to render
  a labelled pin; set `emphasis: true` for a larger tile.
- **Where things sit:** each layer's *named* components live in a front rank
  around `y: 76`, because that band stays visible when the layer above overlaps
  it. The back of each plane carries infrastructure texture that is revealed
  when the layer is selected.
- **Add a relationship:** add a `Flow` in `src/data/flows.ts`. Endpoints are
  layer-relative, so they stay attached as the stack rescales. Anchor them
  toward the front of a plane (`y` roughly 55–75) so they attach to visible
  geometry.
- **Change layer order or spacing:** `architectureLayers` is ordered bottom to
  top; spacing is `LAYER_GAP` in `src/lib/iso.ts`.

---

## Product assets

**No Microsoft product logo is fabricated, approximated or redrawn in this
project.** The brand mark in the header is a neutral geometric shape, not a
Microsoft logo.

Named components currently render **neutral technical glyphs** (Lucide) on a
billboarded tile — a key for Key Vault, a shield for Defender, and so on. These
are generic symbols, not stand-ins for brand marks.

### Adding the official icons

1. Download an official set and accept Microsoft's icon terms:
   - [Azure architecture icons](https://learn.microsoft.com/azure/architecture/icons/) — includes Foundry Models, Foundry Projects and Foundry Agent Service
   - [Microsoft 365 architecture icons](https://learn.microsoft.com/microsoft-365/solutions/architecture-icons-templates)
   - [Microsoft Entra architecture icons](https://learn.microsoft.com/entra/architecture/architecture-icons)
2. Copy the SVGs into `src/assets/logos/` using the file names declared in
   [`src/data/assets.ts`](src/data/assets.ts) — for example `azure-key-vault.svg`,
   `microsoft-teams.svg`, `foundry-agent-service.svg`.
3. That's it. Files are discovered at build time via `import.meta.glob`, so the
   glyph is replaced by the official icon automatically — no config flag, and no
   404 requests for assets you haven't supplied.

Logos render with `object-fit: contain`, so they are never cropped, rotated,
recoloured or distorted, in line with Microsoft's icon guidelines.

Microsoft permits these icons in architecture diagrams, training material and
documentation; review the terms on the pages above before redistributing.

---

## Accessibility

- Every platform is a real `<button>` with an `aria-label` and `aria-pressed`.
- Visible focus rings; `↑`/`↓` move between layers; `Esc` resets.
- The detail panel is an `aria-live` region.
- `prefers-reduced-motion` disables spring animation, line drawing and
  transitions.
- Selection is communicated by lift, border and panel content — not colour alone.

---

## Responsive behaviour

- **Desktop:** full exploded stack, detail panel right, navigator and legend below.
- **≤ 1080px:** narrower detail panel, single-column legend.
- **≤ 860px:** the isometric scene is replaced by a simplified vertical stack of
  labelled slabs. Selection and story mode still work; no horizontal scrolling.

Verified at 1920×1080, 1600×900, 1440×900, 1280×720, 768×1024 and 390×844 with
no clipping, no horizontal scroll and no console errors.

---

## Notes and limitations

- **No Three.js by design.** CSS 3D keeps text crisp, the DOM accessible and the
  deployment trivial.
- **PNG export is not included.** Client-side rasterisers (`html-to-image` and
  similar) do not reliably reproduce CSS 3D transforms, and a broken export would
  undermine the visual. Use an OS screenshot, or `Ctrl/Cmd+P` — a print
  stylesheet hides the interactive chrome.
- The stack is intentionally viewed at a shallow angle. Each platform reveals a
  visible band at rest; selecting a layer fades the platforms above it so its
  full surface can be inspected.
