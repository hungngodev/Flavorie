import { SearchIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Input, InputGroup } from '@chakra-ui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useClickAway } from '@uidotdev/usehooks';
import { bouncy } from 'ldrs';
import { useEffect, useRef, useState } from 'react';
import { Form, useSubmit } from 'react-router-dom';
import customFetch from '../../utils/customFetch';

bouncy.register();

const autoCompleteQuery = (query: string) => {
  return {
    queryKey: ['autoComplete', query],
    queryFn: async () => {
      const data = await customFetch('/meal/autocomplete', {
        params: {
          query: query,
        },
      });
      return data;
    },
  };
};

export const SearchBar = () => {
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
    <Form onSubmit={(e) => setFocus(false)}>
      <Flex align="center" justify="center" padding="1.5">
        <InputGroup borderRadius={5} size="md" maxWidth="1000px">
          <Input
            ref={ref as React.LegacyRef<HTMLInputElement>}
            pr="4.5rem"
            type="text"
            placeholder="Search..."
            value={query}
            name="search"
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
      </Flex>
      <Flex width="100%" justify="center" alignItems={'center'} flexDir="column">
        {focus &&
          (status !== 'pending' ? (
            items.map((item: { title: string }, index: number) => (
              <Flex key={index} justify="center" dir="col" py="2">
                {item.title}
              </Flex>
            ))
          ) : (
            <l-bouncy size="45" speed="1.75" color="black"></l-bouncy>
          ))}
      </Flex>
    </Form>
  );
};
