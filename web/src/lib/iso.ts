/**
 * Isometric projection helpers.
 *
 * The CSS scene applies `perspective(P)` then `rotateX(ROT_X) rotateZ(ROT_Z)`.
 * These functions replicate that exact pipeline in TypeScript so SVG connectors
 * can be drawn in screen space and still land precisely on the CSS 3D planes.
 */

export const ROT_X = 66;
export const ROT_Z = -28;
export const PERSPECTIVE = 2600;

/** Plane dimensions in local (un-rotated) plane space. */
export const PLANE_W = 820;
export const PLANE_H = 320;

/** Vertical distance between two neighbouring architecture planes. */
export const LAYER_GAP = 84;

/**
 * Absolute elevation per layer. The extra gap below AI Experiences gives the
 * hero Agent Service platform more exposed surface in the resting view.
 */
export const LAYER_ELEVATIONS = [0, 84, 168, 252, 336, 458];

const TOTAL_RISE = LAYER_ELEVATIONS[LAYER_ELEVATIONS.length - 1];

/** Nominal design box the scene is authored against; scaled to fit the stage. */
export const DESIGN_W = 1230;
// Includes headroom for perspective magnification along the near edge.
export const DESIGN_H = 736;

/**
 * The stack sits right of centre so the left-hand callout labels have room
 * inside the design box instead of clipping against the stage.
 */
export const ORIGIN_X = 722;

/**
 * Elevation only moves layers upward, so the origin is pushed down by half the
 * total rise to keep the assembled stack centred in the design box. The small
 * bias compensates for perspective magnification along the near edge.
 */
export const ORIGIN_Y = DESIGN_H / 2 + (TOTAL_RISE * Math.sin((ROT_X * Math.PI) / 180)) / 2 - 24;

const RAD = Math.PI / 180;
const cosX = Math.cos(ROT_X * RAD);
const sinX = Math.sin(ROT_X * RAD);
const cosZ = Math.cos(ROT_Z * RAD);
const sinZ = Math.sin(ROT_Z * RAD);

export type Point2D = { x: number; y: number };

/** Elevation of a layer, indexed from 0 at the Azure foundation. */
export function layerElevation(index: number): number {
  return LAYER_ELEVATIONS[index] ?? index * LAYER_GAP;
}

/**
 * Projects a point from plane space to screen space, relative to the centre of
 * the design box. Mirrors `rotateX() rotateZ()` followed by CSS perspective.
 */
export function project(x: number, y: number, z: number): Point2D {
  const x1 = x * cosZ - y * sinZ;
  const y1 = x * sinZ + y * cosZ;

  const y2 = y1 * cosX - z * sinX;
  const z2 = y1 * sinX + z * cosX;

  const scale = PERSPECTIVE / (PERSPECTIVE - z2);
  return { x: x1 * scale, y: y2 * scale };
}

/** Projects a point addressed as a percentage of a layer's plane surface. */
export function projectOnLayer(xPercent: number, yPercent: number, layerIndex: number, lift = 0): Point2D {
  const x = (xPercent / 100 - 0.5) * PLANE_W;
  const y = (yPercent / 100 - 0.5) * PLANE_H;
  return project(x, y, layerElevation(layerIndex) + lift);
}

/** Converts a projected point into SVG coordinates for the design-box viewBox. */
export function toSvg(point: Point2D): Point2D {
  return { x: point.x + ORIGIN_X, y: point.y + ORIGIN_Y };
}

/**
 * Builds a gently curved path between two points. Cross-layer flows bow
 * outward slightly so parallel routes stay readable without arrowheads.
 */
export function curvePath(from: Point2D, to: Point2D, bow = 0.16): string {
  const a = toSvg(from);
  const b = toSvg(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy);
  // Cap the bow so long cross-layer routes stay near-straight and technical.
  const offset = Math.min(length * bow, 16);
  const cx = (a.x + b.x) / 2 + (dy / length) * offset;
  const cy = (a.y + b.y) / 2 - (dx / length) * offset;
  return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
}

/**
 * Plane-space offset that reads as pure horizontal movement on screen, used to
 * push layer callout labels clear of the platform edge.
 */
export const SCREEN_LEFT_VECTOR: Point2D = { x: -1, y: sinZ / cosZ };

/** Counter-rotation that makes an in-scene element face the camera squarely. */
export const BILLBOARD_TRANSFORM = `rotateZ(${-ROT_Z}deg) rotateX(${-ROT_X}deg)`;
