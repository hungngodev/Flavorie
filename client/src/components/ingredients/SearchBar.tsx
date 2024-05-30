import { SearchIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Input, InputGroup } from '@chakra-ui/react';
import { useClickAway } from '@uidotdev/usehooks';
import { useEffect, useState } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debounceValue, setDebounceValue] = useState<T>(value);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => {
      clearTimeout(timeOut);
    };
  }, [value, delay]);
  return debounceValue;
}

const items = ['orange', 'apple', 'lemon'];

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string[]>([]);
  const debounce = useDebounce(query, 1000);
  const [focus, setFocus] = useState(false);
  const ref = useClickAway(() => {
    setFocus(false);
  });

  useEffect(() => {
    const results = items.filter((i) => i.toLowerCase().includes(query));
    setSearchResult(results);
  }, [debounce, query]);
  return (
    <>
      <Flex align="center" justify="center" padding="1.5">
        <InputGroup borderRadius={5} size="md" maxWidth="1000px">
          <Input
            ref={ref as React.LegacyRef<HTMLInputElement>}
            pr="4.5rem"
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocus(true)}
          />
          <IconButton icon={<SearchIcon />} aria-label={'Search'} colorScheme="blue" />
        </InputGroup>
      </Flex>
      <Box width="100%">
        {focus &&
          (searchResult.length > 0 ? (
            searchResult.map((item, index) => (
              <Flex key={index} justify="center" py="2">
                {item}
              </Flex>
            ))
          ) : (
            <Flex justify="center">No items found</Flex>
          ))}
      </Box>
    </>
  );
};
