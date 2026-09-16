import { useCallback, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArchitectureScene } from './components/ArchitectureScene';
import { Controls } from './components/Controls';
import { Header } from './components/Header';
import { LayerDetails } from './components/LayerDetails';
import { Legend } from './components/Legend';
import { StoryNavigator } from './components/StoryNavigator';
import { useArchitectureStory } from './hooks/useArchitectureStory';
import { useMediaQuery } from './hooks/useViewport';

export default function App() {
  const story = useArchitectureStory();
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const compact = useMediaQuery('(max-width: 860px)');

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => undefined);
    } else {
      document.exitFullscreen?.().catch(() => undefined);
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (typing) return;

      switch (event.key) {
        case 'Escape':
          if (story.presentation) story.exitPresentation();
          else if (story.selectedModuleId) story.clearModule();
          else story.reset();
          break;
        case 'p':
        case 'P':
          story.togglePresentation();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'ArrowRight':
          if (story.presentation) {
            event.preventDefault();
            story.next();
          }
          break;
        case 'ArrowLeft':
          if (story.presentation) {
            event.preventDefault();
            story.previous();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [story, toggleFullscreen]);

  return (
    <div className={`app${story.presentation ? ' is-presenting' : ''}`}>
      <Header story={story} onFullscreen={toggleFullscreen} />

      <main className="app-main">
        <section className="stage-column">
          <div className="headline">
            <AnimatePresence mode="wait">
              <motion.div
                key={story.headline}
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                transition={{ duration: reducedMotion ? 0 : 0.3, ease: 'easeOut' }}
              >
                <p className="headline__step">{story.stepLabel}</p>
                <h1 className="headline__text">{story.headline}</h1>
              </motion.div>
            </AnimatePresence>
            <p className="headline__support">
              From models and enterprise context to governed agents and production experiences.
            </p>
          </div>

          <ArchitectureScene story={story} compact={compact} reducedMotion={reducedMotion} />

          <div className="stage-footer">
            <StoryNavigator story={story} />
            <div className="stage-footer__right">
              <Controls story={story} />
              <Legend story={story} />
            </div>
          </div>
        </section>

        <LayerDetails story={story} reducedMotion={reducedMotion} />
      </main>
    </div>
  );
}
