import {
  Home,
  CalendarDays,
  Newspaper,
  Compass,
  ShieldAlert,
  Sunrise,
  BookOpenText,
  Settings,
  Grid2x2,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  colorVar: string;
  inBottomNav: boolean;
  description?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home, colorVar: "--color-cat-weather", inBottomNav: true },
  {
    href: "/events",
    label: "Events",
    icon: CalendarDays,
    colorVar: "--color-cat-events",
    inBottomNav: true,
    description: "Concerts, sports, and things to do nearby",
  },
  {
    href: "/news",
    label: "News",
    icon: Newspaper,
    colorVar: "--color-cat-news",
    inBottomNav: true,
    description: "Local headlines from your area",
  },
  {
    href: "/explore",
    label: "Explore",
    icon: Compass,
    colorVar: "--color-cat-explore",
    inBottomNav: true,
    description: "Landmarks, parks, and points of interest",
  },
  {
    href: "/safety",
    label: "Safety",
    icon: ShieldAlert,
    colorVar: "--color-cat-safety",
    inBottomNav: false,
    description: "Weather alerts, earthquakes & air quality",
  },
  {
    href: "/sky",
    label: "Sky",
    icon: Sunrise,
    colorVar: "--color-cat-sky",
    inBottomNav: false,
    description: "Golden hour, blue hour & moon phase",
  },
  {
    href: "/almanac",
    label: "Almanac",
    icon: BookOpenText,
    colorVar: "--color-cat-almanac",
    inBottomNav: false,
    description: "On this day in history",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    colorVar: "--color-fg-muted",
    inBottomNav: false,
  },
];

export const MORE_ITEM: NavItem = {
  href: "/more",
  label: "More",
  icon: Grid2x2,
  colorVar: "--color-fg-muted",
  inBottomNav: true,
};

export const BOTTOM_NAV_ITEMS = [...NAV_ITEMS.filter((i) => i.inBottomNav), MORE_ITEM];
export const MORE_PAGE_ITEMS = NAV_ITEMS.filter((i) => !i.inBottomNav);
