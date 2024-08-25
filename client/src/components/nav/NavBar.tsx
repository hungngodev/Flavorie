import { Box, useBreakpointValue } from '@chakra-ui/react';
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
        href: '/ingredients',
    },
    {
        label: 'Meals',
        href: '/meals',
    },
    {
        label: 'Community',
        href: '/',
        children: [
            {
                label: 'Browse',
                subLabel: 'Look what others are cooking',
                href: '/community',
            },
            { label: 'Meeting', subLabel: 'Cook with friends', href: '/meeting' },
        ],
    },
    {
        label: 'Upload Receipts',
        href: '/upload-receipts',
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
            bgColor="#D5ffff"
            // color={'white'}
            minH={'60px'}
            py={{ base: 2 }}
            px={{ base: 4 }}
            borderStyle={'solid'}
            borderColor={'#736CED'}
            boxShadow="md"
        >
            {NavtoRender}
        </Box>
    );
}
