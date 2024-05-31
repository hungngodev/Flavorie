import React, { useEffect, useState } from "react";
import {Box, Flex, IconButton, Input, InputGroup } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

function useDebounce<T>(value: T, delay: number): T {
    const [debounceValue, setDebounceValue] = useState<T>(value);
    useEffect (() => {
        const timeOut = setTimeout(() => {
            setDebounceValue(value)
        }, delay)
        return () => {
            clearTimeout(timeOut)
        }
    }, [value, delay])
    return debounceValue
}

const items = ["orange", "apple", "lemon"]

export const SearchBar = () => {
    const [query, setQuery] = useState("")
    const [searchResult, setSearchResult] = useState<string[]>([])
    const debounce = useDebounce(query, 1000)

    useEffect(() => {
        const results = items.filter(i => i.toLowerCase().includes(query))
        setSearchResult(results)
    }, [debounce, query])
    return (
        <>
        <Flex align="center" justify="center" padding="1.5">
            <InputGroup borderRadius={5} size="md" maxWidth="1000px">
            <Input 
            pr="4.5rem"
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)} />
            <IconButton icon={<SearchIcon />} aria-label={"Search"} colorScheme="blue"/>
            
        </InputGroup>
        
        </Flex>
        <Box width="100%">
        {searchResult.length > 0 ? (
                searchResult.map((item, index) => (
                    <Flex key={index} justify="center" py="2">
                        {item}
                    </Flex>
            ))
        ): (
            <Flex justify="center">No items found</Flex>
        )}
        </Box>
        </> 
    )
}