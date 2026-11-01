import {
  UtensilsCrossed,
  Bus,
  Clapperboard,
  ShoppingBag,
  GraduationCap,
  Package,
  Wallet,
  type LucideIcon,
} from 'lucide-react-native';

const ICON_MAP: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Bus,
  Clapperboard,
  ShoppingBag,
  GraduationCap,
  Package,
  Wallet,
};

interface Props {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function CategoryIcon({ name, size = 24, color = 'currentColor', strokeWidth = 2 }: Props) {
  const Icon = ICON_MAP[name] ?? Package;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}
