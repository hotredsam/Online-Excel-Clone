/**
 * Design system class names and token keys for use in components.
 * Keeps TS and CSS in sync; no component logic.
 */

export const glassClasses = {
  panel: 'glass-panel',
  card: 'glass-card',
  sidebar: 'glass-sidebar',
  header: 'glass-header',
  modal: 'glass-modal',
  btn: 'glass-btn',
  btnPrimary: 'glass-btn-primary',
  btnGhost: 'glass-btn-ghost',
  input: 'glass-input',
  title: 'glass-title',
  sectionLabel: 'glass-section-label',
  body: 'glass-body',
  muted: 'glass-muted',
  listRow: 'glass-list-row',
} as const;

export const glassMotion = {
  durationFast: 'var(--glass-duration-fast)',
  duration: 'var(--glass-duration)',
  durationSlow: 'var(--glass-duration-slow)',
  ease: 'var(--glass-ease)',
  transition: 'var(--glass-transition)',
} as const;

export type GlassClass = (typeof glassClasses)[keyof typeof glassClasses];
