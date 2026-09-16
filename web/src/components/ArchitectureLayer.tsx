import { motion } from 'framer-motion';
import type { ArchitectureLayer as LayerData, ArchitectureModule } from '../data/architecture';
import { getProductAsset } from '../data/assets';
import { BILLBOARD_TRANSFORM, layerElevation, PLANE_H, PLANE_W, SCREEN_LEFT_VECTOR } from '../lib/iso';
import { ModuleIcon } from './ModuleIcon';
import { PlateArt } from './PlateArt';

const LABEL_OFFSET = 30;

/** Footprint ratios keep each module kind recognisable at a glance. */
const shapeRatio: Record<string, number> = {
  panel: 0.62,
  device: 1.5,
  gauge: 0.72,
  gate: 0.86
};

function Module({ module }: { module: ArchitectureModule }) {
  const size = module.size ?? 24;
  const ratio = shapeRatio[module.kind] ?? 1;

  return (
    <span
      className={`module module--${module.kind} accent-${module.accent ?? 'neutral'}`}
      style={
        {
          left: `${module.position.x}%`,
          top: `${module.position.y}%`,
          '--w': `${size}px`,
          '--h': `${size * ratio}px`,
          '--t': `${module.height ?? 12}px`
        } as React.CSSProperties
      }
    >
      <span className="module__solid">
        <span className="slab-face slab-face--front" />
        <span className="slab-face slab-face--left" />
        <span className="module__top" />
      </span>
    </span>
  );
}

/** Billboarded product marker seated on its pedestal. Purely visual — the
 *  click target is a projected hotspot rendered above the scene. */
function ModulePin({
  module,
  selected,
  hovered
}: {
  module: ArchitectureModule;
  selected: boolean;
  hovered: boolean;
}) {
  const asset = getProductAsset(module.id);
  const lift = module.emphasis ? 8 : 5;

  return (
    <span
      className={`pin accent-${module.accent ?? 'neutral'}${module.emphasis ? ' pin--emphasis' : ''}${
        selected ? ' is-selected' : ''
      }${hovered ? ' is-hovered' : ''}`}
      style={{
        left: `${module.position.x}%`,
        top: `${module.position.y}%`,
        transform: `translateZ(${lift}px) ${BILLBOARD_TRANSFORM} translate(-50%, -50%)`
      }}
    >
      <span className="pin__tile">
        <ModuleIcon
          icon={module.icon as string}
          moduleId={module.id}
          productName={asset?.productName ?? module.label}
        />
      </span>
    </span>
  );
}

type Props = {
  layer: LayerData;
  index: number;
  revealed: boolean;
  selected: boolean;
  hovered: boolean;
  dimmed: boolean;
  focused: boolean;
  /** True when a lower layer is selected and this one would occlude it. */
  faded: boolean;
  reducedMotion: boolean;
  selectedModuleId: string | null;
  hoveredModuleId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  registerButton: (index: number, element: HTMLButtonElement | null) => void;
};

export function ArchitectureLayer({
  layer,
  index,
  revealed,
  selected,
  hovered,
  dimmed,
  focused,
  faded,
  reducedMotion,
  selectedModuleId,
  hoveredModuleId,
  onSelect,
  onHover,
  registerButton
}: Props) {
  const baseZ = layerElevation(index);
  const lift = selected ? 34 : hovered ? 14 : 0;
  const targetZ = revealed ? baseZ + lift + (faded ? 30 : 0) : baseZ - 70;
  const opacity = revealed ? (faded ? 0.07 : dimmed ? 0.62 : 1) : 0;

  const transition = reducedMotion
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 110, damping: 20, mass: 0.9 };

  return (
    <motion.div
      className={`layer${focused ? ' is-focused' : ''}${dimmed ? ' is-dimmed' : ''}${
        faded ? ' is-faded' : ''
      }`}
      style={{
        transformStyle: 'preserve-3d',
        width: PLANE_W,
        height: PLANE_H,
        pointerEvents: faded || !revealed ? 'none' : 'auto'
      }}
      initial={false}
      animate={{ z: targetZ, opacity }}
      transition={transition}
      aria-hidden={!revealed}
    >
      <div className={`plane accent-${layer.accent}${selected ? ' is-selected' : ''}`}>
        <span className="plane__surface" aria-hidden="true">
          <PlateArt layerId={layer.id} />
        </span>
        <span className="slab-face slab-face--front" aria-hidden="true" />
        <span className="slab-face slab-face--left" aria-hidden="true" />
        <span className="plane__shadow" aria-hidden="true" />

        {layer.modules.map((module) => (
          <Module key={module.id} module={module} />
        ))}

        <span
          className="plane__title"
          aria-hidden="true"
          style={{
            transform: `translate3d(${SCREEN_LEFT_VECTOR.x * LABEL_OFFSET}px, ${
              SCREEN_LEFT_VECTOR.y * LABEL_OFFSET
            }px, 34px) ${BILLBOARD_TRANSFORM} translate(-100%, -50%)`
          }}
        >
          <span className="plane__title-step">{String(layer.step).padStart(2, '0')}</span>
          <span className="plane__title-text">{layer.planeLabel}</span>
          <span className="plane__title-rule" />
        </span>

        <span className="plane__captions" aria-hidden="true">
          {layer.captions.map((caption) => (
            <span
              key={caption.id}
              className={`caption caption--${caption.align ?? 'left'}${
                caption.persistent ? ' caption--persistent' : ''
              }`}
              style={{
                left: `${caption.position.x}%`,
                top: `${caption.position.y}%`,
                transform: `translateZ(26px) ${BILLBOARD_TRANSFORM} translate(${
                  caption.align === 'right' ? '-100%' : '0'
                }, -50%)`
              }}
            >
              {caption.text}
            </span>
          ))}
        </span>
      </div>

      <button
        type="button"
        ref={(element) => registerButton(index, element)}
        className="plane__hit"
        aria-label={`${layer.label}. Step ${layer.step} of 6. ${layer.description}`}
        aria-pressed={selected}
        tabIndex={revealed ? 0 : -1}
        onClick={() => onSelect(layer.id)}
        onPointerEnter={() => onHover(layer.id)}
        onPointerLeave={() => onHover(null)}
        onFocus={() => onHover(layer.id)}
        onBlur={() => onHover(null)}
      />

      <div className="plane__pins" aria-hidden="true">
        {layer.modules
          .filter((module) => module.icon)
          .map((module) => (
            <ModulePin
              key={`pin-${module.id}`}
              module={module}
              selected={selectedModuleId === module.id}
              hovered={hoveredModuleId === module.id}
            />
          ))}
      </div>
    </motion.div>
  );
}
