'use client';
import { ChevronRightIcon } from '@chakra-ui/icons';
import {
    Avatar,
    Box,
    Button,
    Circle,
    Flex,
    Icon,
    Image,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Stack,
    Text,
    useColorModeValue,
    useTheme,
} from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.tsx';
import useNotification from '../../hooks/useNotification.tsx';
import { NavItem } from './NavBar';

export const DesktopNav = ({ NavItems }: { NavItems: NavItem[] }) => {
    const theme = useTheme();
    const linkColor = useColorModeValue('blackAlpha.700', 'gray.300');
    const linkHoverColor = useColorModeValue(theme.colors.palette_purple, 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');
    const auth = useAuth();
    const { numberOfNotifications } = useNotification();

    return (
        <>
            <Flex align={'center'} justifyContent={'space-between'} gap={4}>
                <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                    {/* <Text
                        textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                        fontFamily={'heading'}
                        color={useColorModeValue('gray.800', 'white')}
                        as="b"
                    >
                        Flavorie
                    </Text> */}
                    <Image
                        ml="2"
                        boxSize="50px"
                        objectFit="cover"
                        src="../public/images/branding/Logo.png"
                        alt="logo"
                    />
                    <Flex display={{ base: 'none', md: 'flex' }} ml={6}>
                        <Stack direction={'row'} spacing={4}>
                            {NavItems.map((navItem) => (
                                <Box key={navItem.label}>
                                    <Popover trigger={'hover'} placement={'bottom-start'}>
                                        <PopoverTrigger>
                                            <Box
                                                p={2}
                                                fontSize={'md'}
                                                fontWeight={600}
                                                color={linkColor}
                                                _hover={{
                                                    textDecoration: 'none',
                                                    color: linkHoverColor,
                                                    backgroundColor: 'purple.50',
                                                    rounded: 'xl',
                                                    paddingInline: 2,
                                                }}
                                            >
                                                <Link to={navItem.href ?? '#'}>{navItem.label}</Link>
                                            </Box>
                                        </PopoverTrigger>

                                        {navItem.children && (
                                            <PopoverContent
                                                border={0}
                                                boxShadow={'xl'}
                                                bg={popoverContentBgColor}
                                                p={4}
                                                rounded={'xl'}
                                                minW={'sm'}
                                            >
                                                <Stack>
                                                    {navItem.children.map((child) => (
                                                        <DesktopSubNav key={child.label} {...child} />
                                                    ))}
                                                </Stack>
                                            </PopoverContent>
                                        )}
                                    </Popover>
                                </Box>
                            ))}
                        </Stack>
                    </Flex>
                </Flex>
                <Stack flex={{ base: 2, md: 0 }} justify={'flex-end'} direction={'row'} spacing={2}>
                    {auth.currentUser.status !== 'authenticated' ? (
                        <>
                            <Button
                                fontSize={'sm'}
                                fontWeight={600}
                                variant="outline"
                                borderColor={theme.colors.palette_indigo}
                                color={theme.colors.palette_purple}
                            >
                                <Link to={`/login?redirect=${location.pathname}`}>Sign In</Link>
                            </Button>
                            <Button
                                display={{ base: 'none', md: 'inline-flex' }}
                                fontSize={'sm'}
                                fontWeight={600}
                                color={'white'}
                                bg={theme.colors.palette_purple}
                                _hover={{
                                    bg: theme.colors.palette_indigo,
                                }}
                            >
                                <Link to="/register">Sign Up</Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Box position="relative" display="inline-block">
                                <Link to="/notifications">
                                    <FaBell color="gray" size="24px" />
                                    {numberOfNotifications > 0 && (
                                        <Circle
                                            size="17px"
                                            bg="tomato"
                                            color="white"
                                            position="absolute"
                                            top="-4px"
                                            right="-6px"
                                            fontSize="0.8rem"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                        >
                                            {numberOfNotifications}
                                        </Circle>
                                    )}
                                </Link>
                            </Box>
                            <Button
                                display={{ base: 'none', md: 'inline-flex' }}
                                fontSize={'sm'}
                                fontWeight={600}
                                color={'white'}
                                bg={theme.colors.palette_purple}
                                _hover={{
                                    bg: theme.colors.palette_indigo,
                                }}
                                onClick={auth.logout}
                            >
                                Sign Out
                            </Button>
                        </>
                    )}
                </Stack>
                {auth.currentUser.status === 'authenticated' && (
                    <Link to="/profile">
                        <Avatar size={'md'} src={auth.currentUser.avatar} />
                    </Link>
                    // <Menu>
                    //     <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>

                    //     </MenuButton>
                    //     <MenuList>
                    //         <MenuItem>
                    //             <Link to="/profile">Profile</Link>
                    //         </MenuItem>
                    //         <MenuDivider />
                    //         <MenuItem>Setting</MenuItem>
                    //     </MenuList>
                    // </Menu>
                )}
            </Flex>
        </>
    );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
    return (
        <Link to={href ?? ''}>
            <Box
                role={'group'}
                display={'block'}
                p={2}
                rounded={'md'}
                _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
            >
                <Stack direction={'row'} align={'center'}>
                    <Box>
                        <Text
                            transition={'all .3s ease'}
                            _groupHover={{ color: 'pink.400' }}
                            color="black"
                            fontWeight={500}
                        >
                            {label}
                        </Text>
                        <Text color="black" fontSize={'sm'}>
                            {subLabel}
                        </Text>
                    </Box>
                    <Flex
                        transition={'all .3s ease'}
                        transform={'translateX(-10px)'}
                        opacity={0}
                        _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                        justify={'flex-end'}
                        align={'center'}
                        flex={1}
                    >
                        <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
                    </Flex>
                </Stack>
            </Box>
        </Link>
    );
};
