import { Avatar, Box, Button, FormControl, HStack, Textarea, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import theme from '../../style/theme';
import customFetch from '../../utils/customFetch';
import { createReview } from '../../utils/reviewService';

interface InputProps {
    onSubmit: (id: string, postId: string, content: string, username: string, src: string, parentReviewId: string | null) => void;
    postId: string,
    userId: string,
    avatar: {
        username: string;
        src: string;
    };
    parentReviewId: string | null;
}

const ReviewForm: React.FC<InputProps> = ({ postId, userId, avatar, onSubmit, parentReviewId }) => {
    const [inputContent, setInputContent] = useState('');
    const [error, setError] = useState('');
    // const [parentReview, setParentReview] = useState<string | null>(parentReviewId)

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (inputContent.trim().length === 0) {
        setError('Review cannot be empty');
        return;
        }

        let response;
        if (parentReviewId) {
        response = await createReview(postId, inputContent, parentReviewId);
        console.log('check parentId', response)
        } else {
        response = await createReview(postId, inputContent, '');
        };
        
        if (!response.data) {
        setError('Error creating review');
        }
        console.dir(response)
        const { _id, username, src, content } = response;

        // const response = await customFetch.post('/community/reviews/667506f3f7364781a6092dd0', {
        // content: inputContent,
        // parentReview: null,
        // });

        // if (!response.data) {
        // setError('Error creating new comment');
        // }
        
        // const { _id, postId, username, src, content } = response.data;
        
        // update state
        onSubmit(_id, postId, content, username, src, parentReviewId);
        setInputContent('');
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
                    onChange={(e) => setInputContent(e.target.value)}
                    value={inputContent}
                    placeholder="Leave your comment here"
                    border="1px"
                    borderColor={theme.colors.palette_indigo}
                    />
                    {error && (
                    <Box color="red.500" mt={2}>
                        {error}
                    </Box>
                    )}
                </FormControl>
                <HStack spacing={2} alignSelf="end">
                    <Button
                    variant="outline"
                    borderColor={theme.colors.palette_indigo}
                    color={theme.colors.palette_purple}
                    fontWeight="bold"
                    onClick={() => setInputContent('')}
                    >
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
