import type { AgentIconName } from '@/entities/agent';
import {
  AlertTriangle,
  Binary,
  Boxes,
  Brain,
  CircleDollarSign,
  CodeXml,
  Compass,
  Crosshair,
  Gavel,
  Layers,
  Radar,
  Rocket,
  Server,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sun,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import type { ReactNode } from 'react';

export interface AgentIconProps {
  name: AgentIconName;
  size?: number;
}

export function AgentIcon({ name, size = 22 }: AgentIconProps): ReactNode {
  switch (name) {
    /* Fullstack */
    case 'boxes':
      return <Boxes size={size} />;
    case 'code':
      return <CodeXml size={size} />;
    case 'shield':
      return <ShieldCheck size={size} />;
    case 'server':
      return <Server size={size} />;
    case 'crosshair':
      return <Crosshair size={size} />;

    /* Deep Intel */
    case 'radar':
      return <Radar size={size} />;
    case 'binary':
      return <Binary size={size} />;
    case 'alert-triangle':
      return <AlertTriangle size={size} />;
    case 'brain':
      return <Brain size={size} />;
    case 'layers':
      return <Layers size={size} />;

    /* Venture */
    case 'rocket':
      return <Rocket size={size} />;
    case 'trending-up':
      return <TrendingUp size={size} />;
    case 'shield-alert':
      return <ShieldAlert size={size} />;
    case 'dollar':
      return <CircleDollarSign size={size} />;
    case 'target':
      return <Target size={size} />;

    /* Decision Council */
    case 'compass':
      return <Compass size={size} />;
    case 'sun':
      return <Sun size={size} />;
    case 'zap':
      return <Zap size={size} />;
    case 'sliders':
      return <SlidersHorizontal size={size} />;
    case 'gavel':
      return <Gavel size={size} />;

    default:
      return <Boxes size={size} />;
  }
}
