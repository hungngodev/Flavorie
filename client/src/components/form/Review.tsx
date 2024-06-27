import React,  { useState } from 'react';
import { Avatar, Box, Button, FormControl, FormLabel, HStack, Textarea, VStack } from '@chakra-ui/react';
import { Review } from '../community/reviewCard';
import theme from '../../style/theme';

interface InputProps {
    onSubmit: (content: string) => void;
    avatar: {
        username: string;
        src: string;
    };
}

const ReviewForm: React.FC<InputProps> =({ avatar, onSubmit }) => {
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (content.trim().length === 0) {
            setError('Review cannot be empty');
            return;
        }
        onSubmit(content);
        setContent('');
        setError('');
    };

    return (
        <Box>
            <HStack align="start" spacing="2">
                <Avatar name={avatar.username} src={avatar.src} />
                <Box p="0" bg="white" borderRadius="md" width="600px">
                    <form onSubmit={handleSubmit}>
                        
                            <VStack align="start" spacing="3">
                                <FormControl borderColor={theme.colors.palette_purple} id="content" isInvalid={!!error}>
                                    {/* <FormLabel>Comment</FormLabel> */}
                                    <Textarea
                                    name="content"
                                    onChange={(e) => setContent(e.target.value)}
                                    value={content}
                                    placeholder="Leave your comment here"
                                    border="1px"
                                    borderColor={theme.colors.palette_indigo}
                                    />
                                    {error && (
                                        <Box color="red.500" mt={2}>{error}</Box>
                                    )}
                                </FormControl>
                                <HStack spacing={2} alignSelf="end">
                                    <Button variant="outline" borderColor={theme.colors.palette_indigo} color={theme.colors.palette_purple} fontWeight="bold" onClick={() => setContent('')}>
                                    Cancel
                                    </Button>
                                    <Button bg={theme.colors.palette_purple} color="white" fontWeight="bold" type="submit">
                                    Post Comment
                                    </Button>
                                </HStack>
                            </VStack>
                    </form>
                </Box>
            </HStack>
        </Box>
    );
};

export default ReviewForm;