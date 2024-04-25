'use client';

import { useBreakpointValue } from '@chakra-ui/react';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';

export interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  { label: 'Home', href: '/' },
  {
    label: 'Ingredients',
    children: [
      {
        label: 'Fridge',
        subLabel: 'your leftover foods',
        href: '#',
      },
      {
        label: 'Market',
        subLabel: 'prepare your shopping list',
        href: '#',
      },
    ],
  },
  {
    label: 'Meals',
    href: '#',
  },
  {
    label: 'Community',
    href: '#',
  },
];

export default function NavBar() {
  const NavtoRender = useBreakpointValue({
    base: <MobileNav NavItems={NAV_ITEMS} />,
    md: <DesktopNav NavItems={NAV_ITEMS} />,
  });
  return NavtoRender;
}
