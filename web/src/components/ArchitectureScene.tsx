import { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { architectureLayers, layerIndexById } from '../data/architecture';
import type { StoryState } from '../hooks/useArchitectureStory';
import { useFitScale } from '../hooks/useViewport';
import { DESIGN_H, DESIGN_W, ORIGIN_X, ORIGIN_Y } from '../lib/iso';
import { ArchitectureLayer } from './ArchitectureLayer';
import { FlowLines } from './FlowLines';
import { ModuleHotspots } from './ModuleHotspots';

type Props = {
  story: StoryState;
  compact: boolean;
  reducedMotion: boolean;
};

/** Mobile fallback: the same model, expressed as a readable vertical stack. */
function CompactStack({ story }: { story: StoryState }) {
  return (
    <ol className="compact-stack">
      {[...architectureLayers].reverse().map((layer) => {
        const revealed = layer.step <= story.revealedSteps;
        const selected = story.selectedId === layer.id;
        return (
          <li key={layer.id}>
            <button
              type="button"
              className={`compact-slab accent-${layer.accent}${selected ? ' is-selected' : ''}${
                revealed ? '' : ' is-hidden'
              }`}
              aria-pressed={selected}
              onClick={() => story.select(layer.id)}
            >
              <span className="compact-slab__step">{String(layer.step).padStart(2, '0')}</span>
              <span className="compact-slab__body">
                <span className="compact-slab__label">{layer.label}</span>
                <span className="compact-slab__text">{layer.description}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export function ArchitectureScene({ story, compact, reducedMotion }: Props) {
  const { ref, scale } = useFitScale(DESIGN_W, DESIGN_H, 1.25);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIndex = story.selectedId ? layerIndexById[story.selectedId] : -1;

  const registerButton = useCallback((index: number, element: HTMLButtonElement | null) => {
    buttons.current[index] = element;
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
    const current = buttons.current.indexOf(document.activeElement as HTMLButtonElement);
    if (current === -1) return;
    event.preventDefault();
    const delta = event.key === 'ArrowUp' ? 1 : -1;
    const nextIndex = Math.min(Math.max(current + delta, 0), buttons.current.length - 1);
    buttons.current[nextIndex]?.focus();
  }, []);

  if (compact) {
    return (
      <div className="stage stage--compact">
        <CompactStack story={story} />
      </div>
    );
  }

  return (
    <div className="stage" ref={ref} onKeyDown={handleKeyDown}>
      <div
        className={`scene-scale${reducedMotion ? ' is-static' : ''}`}
        style={
          {
            transform: `scale(${scale})`,
            width: DESIGN_W,
            height: DESIGN_H,
            marginLeft: -DESIGN_W / 2,
            marginTop: -DESIGN_H / 2,
            '--stack-scale': scale,
            '--origin-x': `${ORIGIN_X}px`,
            '--origin-y': `${ORIGIN_Y}px`
          } as React.CSSProperties
        }
      >
        <motion.div className="scene" aria-label="Microsoft Foundry exploded architecture">
          <div className="stack">
            {architectureLayers.map((layer, index) => {
              const revealed = layer.step <= story.revealedSteps;
              const selected = story.selectedId === layer.id;
              const hovered = story.hoveredId === layer.id;
              const focused = story.focusedLayerId === layer.id;
              const dimmed = Boolean(story.dimSourceId) && story.dimSourceId !== layer.id;
              // Selecting a whole layer sends every other layer far back so
              // it stands alone. A component selection leaves the stack intact.
              const faded =
                selectedIndex !== -1 && index !== selectedIndex && !story.selectedModuleId;

              return (
                <ArchitectureLayer
                  key={layer.id}
                  layer={layer}
                  index={index}
                  revealed={revealed}
                  selected={selected}
                  hovered={hovered}
                  focused={focused}
                  dimmed={dimmed}
                  faded={faded}
                  reducedMotion={reducedMotion}
                  selectedModuleId={story.selectedModuleId}
                  hoveredModuleId={story.hoveredModuleId}
                  onSelect={story.select}
                  onHover={story.setHovered}
                  registerButton={registerButton}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Flows are drawn against the resting elevations of the stack, so they
            are hidden whenever a layer or component is isolated — the other
            planes have moved and the arrows would land nowhere. */}
        {!story.selectedModuleId && !story.selectedId && (
          <FlowLines
            revealedSteps={story.revealedSteps}
            focusedLayerId={story.selectedId}
            flowFilter={story.flowFilter}
            animateDraw={story.playing}
            reducedMotion={reducedMotion}
          />
        )}

        <ModuleHotspots
          revealedSteps={story.revealedSteps}
          selectedModuleId={story.selectedModuleId}
          selectedLayerId={story.selectedId}
          onSelect={story.selectModule}
          onHover={story.setHoveredModule}
        />
      </div>
    </div>
  );
}
