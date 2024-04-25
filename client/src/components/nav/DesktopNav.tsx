'use client';

import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import logo from '../../assets/logo.svg';
import { useAuth } from '../../hooks';
import { NavItem } from './NavBar';

export const DesktopNav = ({ NavItems }: { NavItems: NavItem[] }) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');
  const popoverContentBgColor = useColorModeValue('white', 'gray.800');
  const auth = useAuth();

  return (
    <>
      <Box position="sticky" top="0">
        <Flex
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          align={'center'}
          justifyContent={'space-between'}
          gap={4}
        >
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Text
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              fontFamily={'heading'}
              color={useColorModeValue('gray.800', 'white')}
              as="b"
            >
              Flavorie
            </Text>
            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <Stack direction={'row'} spacing={4}>
                {NavItems.map((navItem) => (
                  <Box key={navItem.label}>
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                      <PopoverTrigger>
                        <Box
                          as="a"
                          p={2}
                          href={navItem.href ?? '#'}
                          fontSize={'sm'}
                          fontWeight={500}
                          color={linkColor}
                          _hover={{
                            textDecoration: 'none',
                            color: linkHoverColor,
                          }}
                        >
                          {navItem.label}
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
          <Stack flex={{ base: 2, md: 0 }} justify={'flex-end'} direction={'row'} spacing={6}>
            {auth.currentUser.status !== 'authenticated' ? (
              <>
                <Button as={'a'} fontSize={'sm'} fontWeight={400} variant={'link'} href={'/login'}>
                  Sign In
                </Button>
                <Button
                  as={'a'}
                  display={{ base: 'none', md: 'inline-flex' }}
                  fontSize={'sm'}
                  fontWeight={600}
                  color={'white'}
                  bg={'pink.400'}
                  href={'/register'}
                  _hover={{
                    bg: 'pink.300',
                  }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <Button
                as={'a'}
                display={{ base: 'none', md: 'inline-flex' }}
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
          <Menu>
            <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
              <Avatar size={'sm'} height="50px" src={logo} />
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Box>
    </>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Box
      as="a"
      href={href}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text transition={'all .3s ease'} _groupHover={{ color: 'pink.400' }} fontWeight={500}>
            {label}
          </Text>
          <Text fontSize={'sm'}>{subLabel}</Text>
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
  );
};
