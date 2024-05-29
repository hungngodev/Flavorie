import { Box, useBreakpointValue, useColorModeValue } from '@chakra-ui/react';
import { DesktopNav } from './DesktopNav';
import { MobileNav } from './MobileNav';
import useAuth from '../../hooks/useAuth';
import NotificationHeader from '../notifications/NotificationHeader';
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
        href: '/ingredients',
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
  {
    label: 'Upload Receipts',
    href: '/upload-receipts'
  }
  // {
  //   label: 'Notifications',
  //   href: '/notifications'
  // }
  
];

export default function NavBar() {
  const NavtoRender = useBreakpointValue({
    base: <MobileNav NavItems={NAV_ITEMS} />,
    md: <DesktopNav NavItems={NAV_ITEMS} />,
  });

  const auth = useAuth()
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
