import React,  { useState } from 'react';
import { Box, Button, FormControl, FormLabel, HStack, Textarea, VStack } from '@chakra-ui/react';

interface InputProps {
    onSubmit: (content: string) => void;
}

const ReviewForm: React.FC<InputProps> =({onSubmit}) => {
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
        <Box w="100%" p="4" bg="white" borderRadius="md" boxShadow="md">
            <form onSubmit={handleSubmit}>
                <VStack align="start" spacing="4">
                    <FormControl id="content" isInvalid={!!error}>
                        <FormLabel>Comment</FormLabel>
                        <Textarea
                        name="content"
                        onChange={(e) => setContent(e.target.value)}
                        value={content}
                        placeholder="Leave your comment here"
                        border="1px solid lightgray"
                        />
                        {error && (
                            <Box color="red.500" mt={2}>{error}</Box>
                        )}
                    </FormControl>
                    <HStack spacing={1} alignSelf="end">
                        <Button variant="outline" onClick={() => setContent('')}>
                        Cancel
                        </Button>
                        <Button colorScheme="blue" type="submit">
                        Post Comment
                        </Button>
                    </HStack>
                </VStack>
            </form>
        </Box>
    );
};

export default ReviewForm;