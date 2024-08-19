import { SearchIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Input, InputGroup, Stack, VStack } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useClickAway } from '@uidotdev/usehooks';
import { bouncy } from 'ldrs';
import { useEffect, useRef, useState } from 'react';
import { Form, useSubmit } from 'react-router-dom';
import theme from '../../style/theme';
import customFetch from '../../utils/customFetch';

bouncy.register();

export const SearchBar = ({ autoCompleteLink }: { autoCompleteLink: string }) => {
    const autoCompleteQuery = (query: string) => {
        return {
            queryKey: ['autoComplete', query],
            queryFn: async () => {
                const data = await customFetch(autoCompleteLink, {
                    params: {
                        query: query,
                    },
                });
                return data;
            },
        };
    };

    const [query, setQuery] = useState('');
    const [autoComplete, setAutoComplete] = useState<string>('');
    const [focus, setFocus] = useState(false);
    const queryClient = useQueryClient();
    const submit = useSubmit();

    const ref = useClickAway(() => {
        setFocus(false);
    });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { data: queryData, status } = useQuery(autoCompleteQuery(autoComplete));
    const items = queryData?.data;

    useEffect(() => {
        const timeOut = setTimeout(() => {
            queryClient.cancelQueries({ queryKey: ['autoComplete', autoComplete] });
            setAutoComplete(query);
        }, 500);
        return () => {
            clearTimeout(timeOut);
        };
    }, [query]);

    return (
        <Flex width="100%" justifyContent={'center'}>
            <VStack ref={ref as React.LegacyRef<HTMLDivElement>} width={'40%'} gap={0}>
                <Form onSubmit={() => setFocus(false)} style={{ width: '100%' }}>
                    <Stack width="100%" justify="center" mb="25">
                        <InputGroup borderRadius={5} size="md" width={'100%'} minWidth={'30vw'}>
                            <Input
                                pr="4.5rem"
                                type="text"
                                placeholder="Search..."
                                borderColor={theme.colors.palette_indigo}
                                value={query}
                                name="search"
                                focusBorderColor={theme.colors.palette_purple}
                                onChange={(e) => setQuery(e.target.value)}
                                onFocus={() => setFocus(true)}
                            />
                            <IconButton
                                icon={<SearchIcon />}
                                aria-label={'Search'}
                                colorScheme="blue"
                                type="submit"
                                ref={buttonRef}
                                onClick={() => submit(buttonRef.current)}
                            />
                        </InputGroup>
                        {items?.length > 0 && (
                            <Box
                                w="94%"
                                maxWidth="70vw"
                                justifyContent="flex-start"
                                alignItems={'flex-start'}
                                border="1px solid black"
                                borderRadius={5}
                                borderColor={theme.colors.palette_indigo}
                                boxShadow="md"
                                display={focus ? 'flex' : 'none'}
                                borderTop="none"
                            >
                                {focus &&
                                    (status !== 'pending' ? (
                                        <VStack width="100%" gap={2}>
                                            {items.map((item: { title: string }, index: number) => (
                                                <div className="w-full hover:bg-slate-400">
                                                    <Flex
                                                        key={index}
                                                        justify="left"
                                                        dir="col"
                                                        ml="2"
                                                        py={1}
                                                        onClick={() => {
                                                            setQuery(item.title);
                                                            setFocus(false);
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                setQuery(item.title);
                                                                setFocus(false);
                                                            }
                                                        }}
                                                    >
                                                        {item.title}
                                                    </Flex>
                                                </div>
                                            ))}
                                        </VStack>
                                    ) : (
                                        <div className="mt-4">
                                            <l-bouncy size="45" speed="1.75" color="black"></l-bouncy>
                                        </div>
                                    ))}
                            </Box>
                        )}
                    </Stack>
                </Form>
            </VStack>
        </Flex>
    );
};
