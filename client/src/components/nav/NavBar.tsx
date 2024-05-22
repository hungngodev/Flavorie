import { Box, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
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
        href: '/',
      },
      {
        label: 'Market',
        subLabel: 'prepare your shopping list',
        href: '/ingredients/meat',
      },
    ],
  },
  {
    label: 'Meals',
    href: '/meals',
  },
  {
    label: 'Community',
    href: '/community',
  },
];

export default function NavBar() {
  const NavtoRender = useBreakpointValue({
    base: <MobileNav NavItems={NAV_ITEMS} />,
    md: <DesktopNav NavItems={NAV_ITEMS} />,
  });
  return (
    <Box
      position="sticky"
      top="0"
      zIndex={19}
      width={'100%'}
      bg={useColorModeValue('green.200', 'gray.800')}
      color={useColorModeValue('gray.600', 'white')}
      minH={'60px'}
      py={{ base: 2 }}
      px={{ base: 4 }}
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={useColorModeValue('gray.200', 'gray.900')}
    >
      {NavtoRender}
    </Box>
  );
}
