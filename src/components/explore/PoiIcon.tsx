import {
  Utensils,
  Coffee,
  Beer,
  Book,
  Clapperboard,
  Drama,
  ShoppingBasket,
  Trees,
  Dumbbell,
  Baby,
  Landmark,
  Image as ImageIcon,
  Sparkles,
  Mountain,
  ShoppingCart,
  MapPin,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  utensils: Utensils,
  coffee: Coffee,
  beer: Beer,
  book: Book,
  clapperboard: Clapperboard,
  drama: Drama,
  "shopping-basket": ShoppingBasket,
  trees: Trees,
  dumbbell: Dumbbell,
  baby: Baby,
  landmark: Landmark,
  image: ImageIcon,
  sparkles: Sparkles,
  mountain: Mountain,
  "shopping-cart": ShoppingCart,
  "map-pin": MapPin,
};

export function PoiIcon({ icon, size = 16, className = "" }: { icon: string; size?: number; className?: string }) {
  const Icon = ICON_MAP[icon] ?? MapPin;
  return <Icon size={size} className={className} />;
}
