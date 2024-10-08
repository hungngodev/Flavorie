import { ChevronDownIcon, CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
    Box,
    Button,
    Collapse,
    Grid,
    GridItem,
    Icon,
    IconButton,
    Stack,
    Text,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks';
import { NavItem } from './NavBar';

export const MobileNav = ({ NavItems }: { NavItems: NavItem[] }) => {
    const auth = useAuth();
    if (auth.currentUser.status === 'authenticated') {
        NavItems = [
            ...NavItems,
            {
                label: 'Your Account',
                children: [
                    {
                        label: 'Profile',
                        href: '#',
                    },
                    {
                        label: 'Sign out',
                        href: '#',
                    },
                ],
            },
        ];
    }
    const { isOpen, onToggle } = useDisclosure();
    return (
        <>
            <Grid templateColumns={'repeat(12, 1fr)'}>
                <GridItem
                    colSpan={3}
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}
                >
                    <IconButton
                        onClick={onToggle}
                        icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </GridItem>
                <GridItem
                    colSpan={6}
                    textAlign={'center'}
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                >
                    <Text fontFamily={'heading'} color={useColorModeValue('gray.800', 'white')} as="b">
                        Flavorie
                    </Text>
                </GridItem>
                <GridItem colSpan={3}>
                    <Stack flex={{ base: 2, md: 0 }} justify={'flex-end'} direction={'row'} spacing={6}>
                        {auth.currentUser.status !== 'authenticated' ? (
                            <>
                                <Button
                                    display={{ base: 'inline-flex' }}
                                    fontSize={'sm'}
                                    fontWeight={600}
                                    color={'white'}
                                    bg={'pink.400'}
                                    _hover={{
                                        bg: 'pink.300',
                                    }}
                                >
                                    <Link to="/login">Log In</Link>
                                </Button>
                            </>
                        ) : (
                            <Button
                                display={{ base: 'inline-flex' }}
                                fontSize={'sm'}
                                fontWeight={600}
                                color={'white'}
                                bg={'pink.400'}
                                onClick={auth.logout}
                                _hover={{
                                    bg: 'pink.300',
                                }}
                            >
                                Log Out
                            </Button>
                        )}
                    </Stack>
                </GridItem>
            </Grid>
            <Collapse in={isOpen} animateOpacity>
                <Stack bg={useColorModeValue('white', 'gray.800')} p={4} display={{ md: 'none' }}>
                    {NavItems.map((navItem) => (
                        <MobileNavItem key={navItem.label} {...navItem} />
                    ))}
                </Stack>
            </Collapse>
        </>
    );
};

export const MobileNavItem = ({ label, children, href }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Box
                py={2}
                justifyContent="space-between"
                alignItems="center"
                _hover={{
                    textDecoration: 'none',
                }}
            >
                <Link to={href ?? '#'}>
                    <Text fontWeight={600} color={useColorModeValue('gray.600', 'gray.200')}>
                        {label}
                    </Text>
                    {children && (
                        <Icon
                            as={ChevronDownIcon}
                            transition={'all .25s ease-in-out'}
                            transform={isOpen ? 'rotate(180deg)' : ''}
                            w={6}
                            h={6}
                        />
                    )}
                </Link>
            </Box>

            <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align={'start'}
                >
                    {children &&
                        children.map((child) => (
                            <Box as="a" key={child.label} py={2} href={child.href}>
                                {child.label}
                            </Box>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};
