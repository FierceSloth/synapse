export type AgentColorTheme = 'blue' | 'cyan' | 'amber' | 'indigo' | 'purple';

export type AgentIconName =
  | 'boxes'
  | 'code'
  | 'shield'
  | 'server'
  | 'crosshair'
  | 'radar'
  | 'binary'
  | 'alert-triangle'
  | 'brain'
  | 'layers'
  | 'rocket'
  | 'trending-up'
  | 'shield-alert'
  | 'dollar'
  | 'target'
  | 'compass'
  | 'sun'
  | 'zap'
  | 'sliders'
  | 'gavel';

export interface SwarmAgent {
  name: string;
  iconName: AgentIconName;
}
