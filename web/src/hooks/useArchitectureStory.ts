import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { architectureLayers, finalStory, findModule, TOTAL_STEPS } from '../data/architecture';
import type { FlowKind } from '../data/flows';

const STEP_DURATION = 1800;
const HERO_STEP_DURATION = 2600; // hold on Agent Service
const HERO_STEP = 5;

export type StoryState = ReturnType<typeof useArchitectureStory>;

export function useArchitectureStory() {
  const [storyStep, setStoryStep] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [presentation, setPresentation] = useState(false);
  const [flowFilter, setFlowFilter] = useState<FlowKind | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [hoveredModuleId, setHoveredModuleId] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const play = useCallback(() => {
    setSelectedId(null);
    setSelectedModuleId(null);
    setStoryStep((current) => (current === null || current >= TOTAL_STEPS ? 1 : current));
    setPlaying(true);
  }, []);

  const pause = useCallback(() => setPlaying(false), []);

  const reset = useCallback(() => {
    clearTimer();
    setPlaying(false);
    setStoryStep(null);
    setSelectedId(null);
    setHoveredId(null);
    setFlowFilter(null);
    setSelectedModuleId(null);
  }, [clearTimer]);

  const goToStep = useCallback(
    (step: number) => {
      clearTimer();
      setPlaying(false);
      setSelectedId(null);
      setSelectedModuleId(null);
      setStoryStep(Math.min(Math.max(step, 1), TOTAL_STEPS));
    },
    [clearTimer]
  );

  const next = useCallback(() => {
    setSelectedId(null);
    setStoryStep((current) => {
      if (current === null) return 1;
      return Math.min(current + 1, TOTAL_STEPS);
    });
  }, []);

  const previous = useCallback(() => {
    setSelectedId(null);
    setStoryStep((current) => {
      if (current === null) return TOTAL_STEPS - 1;
      return Math.max(current - 1, 1);
    });
  }, []);

  const select = useCallback((id: string | null) => {
    setPlaying(false);
    setSelectedModuleId(null);
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  /** Selecting a component also focuses the layer it belongs to. */
  const selectModule = useCallback((moduleId: string, layerId: string) => {
    setPlaying(false);
    setSelectedModuleId((current) => {
      if (current === moduleId) return null;
      setSelectedId(layerId);
      return moduleId;
    });
  }, []);

  useEffect(() => {
    if (!playing || storyStep === null) return;
    if (storyStep >= TOTAL_STEPS) {
      setPlaying(false);
      return;
    }
    const duration = storyStep === HERO_STEP ? HERO_STEP_DURATION : STEP_DURATION;
    timer.current = window.setTimeout(() => {
      setStoryStep((current) => (current === null ? 1 : Math.min(current + 1, TOTAL_STEPS)));
    }, duration);
    return () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [playing, storyStep]);

  const revealedSteps = useMemo(() => {
    if (storyStep === null) return architectureLayers.length;
    return Math.min(storyStep, architectureLayers.length);
  }, [storyStep]);

  const storyLayer = useMemo(() => {
    if (storyStep === null || storyStep > architectureLayers.length) return null;
    return architectureLayers.find((layer) => layer.step === storyStep) ?? null;
  }, [storyStep]);

  const selectedLayer = useMemo(
    () => architectureLayers.find((layer) => layer.id === selectedId) ?? null,
    [selectedId]
  );

  const selectedModule = useMemo(
    () => (selectedModuleId ? findModule(selectedModuleId) ?? null : null),
    [selectedModuleId]
  );

  /** The layer that owns the detail panel and connector emphasis. */
  const activeLayer = selectedLayer ?? storyLayer;

  /** Adds hover emphasis without changing the panel contents. */
  const focusedLayerId = hoveredId ?? activeLayer?.id ?? null;

  /**
   * Only an explicit hover or a whole-layer selection dims the rest of the
   * stack. Inspecting a single component leaves everything else readable.
   */
  const dimSourceId = hoveredId ?? (selectedModuleId ? null : selectedId);

  const headline = activeLayer?.headline ?? (storyStep === TOTAL_STEPS ? finalStory.headline : finalStory.headline);

  const stepLabel = activeLayer ? String(activeLayer.step).padStart(2, '0') : String(TOTAL_STEPS).padStart(2, '0');

  return {
    storyStep,
    playing,
    presentation,
    selectedId,
    hoveredId,
    revealedSteps,
    activeLayer,
    selectedLayer,
    storyLayer,
    focusedLayerId,
    dimSourceId,
    selectedModuleId,
    selectedModule,
    hoveredModuleId,
    setHoveredModule: setHoveredModuleId,
    selectModule,
    clearModule: () => setSelectedModuleId(null),
    flowFilter,
    toggleFlowFilter: (kind: FlowKind) =>
      setFlowFilter((current) => (current === kind ? null : kind)),
    headline,
    stepLabel,
    play,
    pause,
    reset,
    next,
    previous,
    goToStep,
    select,
    setHovered: setHoveredId,
    togglePresentation: () => setPresentation((value) => !value),
    exitPresentation: () => setPresentation(false)
  };
}
