import { flowKindMeta, type FlowKind } from '../data/flows';
import type { StoryState } from '../hooks/useArchitectureStory';

const order: FlowKind[] = ['request', 'knowledge', 'telemetry', 'policy'];

export function Legend({ story }: { story: StoryState }) {
  return (
    <div className="legend">
      <h2 className="legend__title">Flows — select to isolate</h2>
      <ul>
        {order.map((kind) => {
          const active = story.flowFilter === kind;
          return (
            <li key={kind}>
              <button
                type="button"
                className={`legend__item${active ? ' is-active' : ''}`}
                aria-pressed={active}
                title={flowKindMeta[kind].description}
                onClick={() => story.toggleFlowFilter(kind)}
              >
                <svg
                  className={`legend__line legend__line--${kind}`}
                  viewBox="0 0 34 8"
                  aria-hidden="true"
                >
                  <line x1="1" y1="4" x2="26" y2="4" />
                  <path className="legend__head" d="M 26 1.5 L 32 4 L 26 6.5 z" />
                </svg>
                <span className="legend__label">{flowKindMeta[kind].label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
