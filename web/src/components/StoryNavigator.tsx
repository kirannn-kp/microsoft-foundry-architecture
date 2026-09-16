import { architectureLayers, TOTAL_STEPS } from '../data/architecture';
import type { StoryState } from '../hooks/useArchitectureStory';

export function StoryNavigator({ story }: { story: StoryState }) {
  const current = story.activeLayer?.step ?? story.storyStep;

  return (
    <nav className="navigator" aria-label="Architecture story steps">
      <ol>
        {architectureLayers.map((layer) => {
          const isCurrent = current === layer.step;
          const isReached = layer.step <= story.revealedSteps && story.storyStep !== null;
          return (
            <li key={layer.id}>
              <button
                type="button"
                className={`navigator__step${isCurrent ? ' is-current' : ''}${isReached ? ' is-reached' : ''}`}
                aria-current={isCurrent ? 'step' : undefined}
                onClick={() => story.goToStep(layer.step)}
              >
                <span className="navigator__number">{String(layer.step).padStart(2, '0')}</span>
                <span className="navigator__label">{layer.shortLabel}</span>
              </button>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            className={`navigator__step navigator__step--final${
              story.storyStep === TOTAL_STEPS ? ' is-current' : ''
            }`}
            onClick={() => story.goToStep(TOTAL_STEPS)}
          >
            <span className="navigator__number">07</span>
            <span className="navigator__label">Complete</span>
          </button>
        </li>
      </ol>
    </nav>
  );
}
