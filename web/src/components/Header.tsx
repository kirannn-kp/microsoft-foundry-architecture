import { Maximize2, Pause, Play, Presentation, RotateCcw } from 'lucide-react';
import { getBrandLogoUrl } from '../data/assets';
import type { StoryState } from '../hooks/useArchitectureStory';

type Props = {
  story: StoryState;
  onFullscreen: () => void;
};

export function Header({ story, onFullscreen }: Props) {
  const microsoftLogo = getBrandLogoUrl('microsoft');
  const foundryLogo = getBrandLogoUrl('foundry');

  return (
    <header className="app-header">
      <div className="brand">
        {microsoftLogo || foundryLogo ? (
          <span className="brand__marks" aria-hidden="true">
            {microsoftLogo ? <img src={microsoftLogo} alt="" className="brand__logo" /> : null}
            {foundryLogo ? <img src={foundryLogo} alt="" className="brand__logo brand__logo--foundry" /> : null}
          </span>
        ) : (
          <span className="brand__mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        )}
        <span className="brand__text">
          <span className="brand__title">Microsoft Foundry</span>
          <span className="brand__subtitle">The AI app and agent factory</span>
        </span>
      </div>

      <div className="app-header__actions">
        <button
          type="button"
          className="button button--primary"
          onClick={story.playing ? story.pause : story.play}
        >
          {story.playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          {story.playing ? 'Pause' : 'Play architecture'}
        </button>
        <button type="button" className="button" onClick={story.reset}>
          <RotateCcw size={16} aria-hidden="true" />
          Reset
        </button>
        <button
          type="button"
          className={`button button--icon${story.presentation ? ' is-active' : ''}`}
          onClick={story.togglePresentation}
          aria-pressed={story.presentation}
          aria-label="Toggle presentation mode (P)"
          title="Presentation mode (P)"
        >
          <Presentation size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="button button--icon"
          onClick={onFullscreen}
          aria-label="Toggle fullscreen (F)"
          title="Fullscreen (F)"
        >
          <Maximize2 size={16} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
