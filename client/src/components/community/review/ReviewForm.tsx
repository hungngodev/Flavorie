import { Avatar, Box, Button, FormControl, HStack, Link, Text, Textarea, VStack, useTheme } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
// import { createReview } from '../../../utils/reviewService';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../../hooks/useAuth';
import {
    createReviewRequest,
    selectCreateReviewStatus,
    selectDeleteReviewStatus,
    selectEditReviewStatus,
} from '../../../slices/reviews/index';
import { AppDispatch } from '../../../store/store';
interface ReviewFormProps {
    onSubmit?: (arg?: any) => void;
    postId: string;
    parentReviewId: string | null;
    action: 'edit' | 'create';
}

const ReviewForm: React.FC<ReviewFormProps> = ({ postId, action, parentReviewId }) => {
    const [inputContent, setInputContent] = useState('');
    const [error, setError] = useState('');
    const [isDisplayed, setIsDisplayed] = useState(true);
    const [loading, setLoading] = useState(false);

    const textRef = useRef<HTMLTextAreaElement>(null);

    const queryClient = useQueryClient();
    const auth = useAuth();
    const { avatar, username } = auth.currentUser;

    const dispatch = useDispatch<AppDispatch>();
    const theme = useTheme();

    const editStatus = useSelector(selectEditReviewStatus);
    const deleteStatus = useSelector(selectDeleteReviewStatus);
    const createStatus = useSelector(selectCreateReviewStatus);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (inputContent.trim().length === 0) {
            setError('Review cannot be empty');
            return;
        }

        // const response = await createReview(postId, inputContent, parentReviewId ?? null);
        await dispatch(
            createReviewRequest({ postId, content: inputContent, parentReview: parentReviewId ?? null }),
        ).then(() => {
            queryClient.invalidateQueries();
            if (action === 'edit') {
                setIsDisplayed(false);
            }
        });
        setInputContent('');
        setError('');
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // Prevents adding a new line in the textarea
            handleSubmit(event); // Triggers form submit
        }
    };
    useEffect(() => {
        setLoading(deleteStatus === 'loading' || editStatus === 'loading' || createStatus === 'loading');
    }, [editStatus, deleteStatus, createStatus]);

    return isDisplayed ? (
        <HStack
            align="start"
            spacing="2"
            width="100%"
            backdropBlur={loading && 'blur(13px)'}
            pointerEvents={loading ? 'none' : 'auto'}
            opacity={loading ? 0.5 : 1}
        >
            {auth.currentUser.status === 'authenticated' && <Avatar name={username} src={avatar} />}
            <Box p="0" bg="white" borderRadius="md" width="100%">
                {auth.currentUser.status === 'authenticated' ? (
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
                                    ref={textRef}
                                    onKeyDown={handleKeyDown}
                                    sx={{
                                        '::file-selector-button': {
                                            display: 'none',
                                        },
                                    }}
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
                                    onClick={() => {
                                        setInputContent('');
                                        setIsDisplayed(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button bg={theme.colors.palette_purple} color="white" fontWeight="bold" type="submit">
                                    Post Comment
                                </Button>
                            </HStack>
                        </VStack>
                    </form>
                ) : (
                    <Text width="100%" textAlign="center" color="backAlpha.700" fontWeight="semibold" size="lg">
                        <Link href="/login" color={theme.colors.palette_purple}>
                            Sign in
                        </Link>{' '}
                        and get cooking now!
                    </Text>
                )}
            </Box>
        </HStack>
    ) : null;
};

export default ReviewForm;
