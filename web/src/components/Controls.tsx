import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import type { StoryState } from '../hooks/useArchitectureStory';

export function Controls({ story }: { story: StoryState }) {
  return (
    <div className="controls" role="group" aria-label="Story playback">
      <button type="button" className="button button--icon" onClick={story.previous} aria-label="Previous step">
        <ChevronLeft size={16} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="button button--icon"
        onClick={story.playing ? story.pause : story.play}
        aria-label={story.playing ? 'Pause story' : 'Play story'}
      >
        {story.playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      </button>
      <button type="button" className="button button--icon" onClick={story.next} aria-label="Next step">
        <ChevronRight size={16} aria-hidden="true" />
      </button>
      <button type="button" className="button button--icon" onClick={story.reset} aria-label="Reset architecture">
        <RotateCcw size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
