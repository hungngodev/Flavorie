import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import React, { useState } from 'react';
import useUser from '../../hooks/useUser';
import theme from '../../style/theme';

export const NameInput: React.FC = () => {
    const { userName, setUserName } = useUser();

    const [value, setValue] = useState<string>(userName);

    return (
        <InputGroup size="md">
            <Input
                pr="4.5rem"
                type="text"
                value={value}
                borderColor={value ? theme.colors.palette_purple : theme.colors.palette_indigo}
                focusBorderColor={theme.colors.palette_purple}
                placeholder="Name"
                onChange={(e) => setValue(e.target.value)}
            />
            <InputRightElement width="4.5rem" marginRight={'1rem'}>
                <Button
                    h="1.75rem"
                    size="sm"
                    onClick={() => {
                        setUserName(value);
                    }}
                >
                    Update
                </Button>
            </InputRightElement>
        </InputGroup>
    );
};
