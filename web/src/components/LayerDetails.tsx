import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { finalStory, moduleDescriptions } from '../data/architecture';
import { getProductAsset } from '../data/assets';
import type { StoryState } from '../hooks/useArchitectureStory';

type Props = {
  story: StoryState;
  reducedMotion: boolean;
};

export function LayerDetails({ story, reducedMotion }: Props) {
  const focus = story.selectedModule;
  const layer = story.activeLayer;
  const key = focus?.module.id ?? layer?.id ?? 'complete';

  const title = focus ? focus.module.label : layer?.label ?? finalStory.label;
  const step = layer ? String(layer.step).padStart(2, '0') : '07';
  const description = focus
    ? moduleDescriptions[focus.module.id] ?? focus.module.category
    : layer?.description ?? finalStory.description;
  const value = layer?.valueStatement ?? finalStory.valueStatement;
  const asset = focus ? getProductAsset(focus.module.id) : undefined;

  return (
    <aside className="details" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
          transition={{ duration: reducedMotion ? 0 : 0.28, ease: 'easeOut' }}
        >
          <p className="details__step">{step}</p>
          <h2 className="details__title">{title}</h2>
          <p className="details__description">{description}</p>

          {focus ? (
            <>
              <section className="details__section">
                <h3>Component</h3>
                <ul className="details__list">
                  <li>{focus.module.category}</li>
                  <li>Part of {focus.layer.label}</li>
                  {asset ? <li>Product: {asset.productName}</li> : null}
                </ul>
              </section>
              <button type="button" className="button details__back" onClick={story.clearModule}>
                <ArrowLeft size={15} aria-hidden="true" />
                Back to {focus.layer.planeLabel}
              </button>
            </>
          ) : layer ? (
            <>
              <section className="details__section">
                <h3>Capabilities</h3>
                <ul className="chips">
                  {layer.capabilities.map((capability) => (
                    <li key={capability} className="chip">
                      {capability}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="details__section">
                <h3>Connects to</h3>
                <ul className="details__list">
                  {layer.connections.map((connection) => (
                    <li key={connection}>{connection}</li>
                  ))}
                </ul>
              </section>
            </>
          ) : (
            <section className="details__section">
              <h3>The complete stack</h3>
              <ul className="details__list">
                <li>Experiences deliver governed agents to people and applications.</li>
                <li>Agents orchestrate models, knowledge and enterprise tools.</li>
                <li>Operations and governance apply to every layer continuously.</li>
              </ul>
            </section>
          )}

          <section className="details__section details__section--value">
            <h3>Why it matters</h3>
            <p>{value}</p>
          </section>
        </motion.div>
      </AnimatePresence>

      <p className="details__hint">
        Select a layer, or click any component icon to inspect it. Press <kbd>Esc</kbd> to go back.
      </p>
    </aside>
  );
}
