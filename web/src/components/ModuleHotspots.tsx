import { architectureLayers, layerIndexById } from '../data/architecture';
import { DESIGN_H, DESIGN_W, projectOnLayer, toSvg } from '../lib/iso';

/**
 * Click targets and name labels for every component, drawn in flat screen
 * space using the same projection as the 3D scene.
 *
 * Labels live here rather than inside the billboarded 3D pins: text nested in
 * a CSS 3D transform chain without `transform-style: preserve-3d` on every
 * ancestor gets foreshortened to an unreadable sliver. A flat overlay avoids
 * that entirely and keeps names crisp at any scale.
 */

type Props = {
  revealedSteps: number;
  selectedModuleId: string | null;
  selectedLayerId: string | null;
  onSelect: (moduleId: string, layerId: string) => void;
  onHover: (moduleId: string | null) => void;
};

export function ModuleHotspots({
  revealedSteps,
  selectedModuleId,
  selectedLayerId,
  onSelect,
  onHover
}: Props) {
  return (
    <div className="hotspots">
      {architectureLayers.map((layer) => {
        if (layer.step > revealedSteps) return null;
        const layerIndex = layerIndexById[layer.id];
        const hiddenByXray =
          selectedLayerId !== null &&
          !selectedModuleId &&
          layerIndex > layerIndexById[selectedLayerId];
        if (hiddenByXray) return null;

        return layer.modules
          .filter((module) => module.icon)
          .map((module) => {
            const selected = selectedModuleId === module.id;
            const lift = module.emphasis ? 8 : 5;
            const point = toSvg(
              projectOnLayer(module.position.x, module.position.y, layerIndex, lift)
            );
            const size = module.emphasis ? 34 : 28;
            const left = `${(point.x / DESIGN_W) * 100}%`;
            const top = `${(point.y / DESIGN_H) * 100}%`;

            return (
              <span key={module.id}>
                <button
                  type="button"
                  className={`hotspot${selected ? ' is-selected' : ''}`}
                  aria-label={`${module.label}. ${module.category}, in ${layer.label}.`}
                  aria-pressed={selected}
                  style={{ left, top, width: size, height: size }}
                  onClick={() => onSelect(module.id, layer.id)}
                  onPointerEnter={() => onHover(module.id)}
                  onPointerLeave={() => onHover(null)}
                  onFocus={() => onHover(module.id)}
                  onBlur={() => onHover(null)}
                />
                <span
                  className={`module-label${selected ? ' is-selected' : ''}`}
                  style={{ left, top, transform: `translate(-50%, ${size / 2 + 7}px)` }}
                  aria-hidden="true"
                >
                  {module.label}
                </span>
              </span>
            );
          });
      })}
    </div>
  );
}
