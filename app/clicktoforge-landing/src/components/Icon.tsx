import React from 'react';
import {
  ArrowRight,
  Check,
  ChevronsUpDown,
  Cpu,
  Flame,
  Gauge,
  LayoutGrid,
  Lock,
  Mail,
  Menu,
  Moon,
  PencilLine,
  Search,
  Send,
  Sparkles,
  Sun,
  Timer,
  TrendingUp,
  Type,
  Wand2,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react-native';
import { usePalette } from '../theme/ThemeContext';

/**
 * Mirrors components/core/Icon.jsx: `<Icon name="flame" />` never a hand-rolled SVG.
 * Lucide, outline, 1.5px stroke — the working vocabulary from the DS readme.
 */
const REGISTRY: Record<string, LucideIcon> = {
  'arrow-right': ArrowRight,
  check: Check,
  'chevron-up-down': ChevronsUpDown,
  cpu: Cpu,
  flame: Flame,
  gauge: Gauge,
  'layout-grid': LayoutGrid,
  lock: Lock,
  mail: Mail,
  menu: Menu,
  moon: Moon,
  'pencil-line': PencilLine,
  search: Search,
  send: Send,
  sparkles: Sparkles,
  sun: Sun,
  timer: Timer,
  'trending-up': TrendingUp,
  type: Type,
  'wand-2': Wand2,
  x: X,
  zap: Zap,
};

export type IconName = keyof typeof REGISTRY;

export function Icon({
  name,
  size = 16,
  color,
  strokeWidth = 1.5,
}: {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const p = usePalette();
  const Cmp = REGISTRY[name];
  if (!Cmp) return null;
  return <Cmp size={size} color={color ?? p.textPrimary} strokeWidth={strokeWidth} />;
}
