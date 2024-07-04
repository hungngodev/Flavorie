import { Avatar, Box, Button, FormControl, HStack, Textarea, VStack, Text, Link, useTheme } from '@chakra-ui/react';
import React, { useState } from 'react';
import theme from '../../../style/theme';
import customFetch from '../../../utils/customFetch';
// import { createReview } from '../../../utils/reviewService';
import useAuth from '../../../hooks/useAuth';
import { createReview } from '../../../slices/reviews/CreateReview';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';

interface InputProps {
  onSubmit?: (arg?: any) => void;
  postId: string;
  parentReviewId: string | null;
}

const ReviewForm: React.FC<InputProps> = ({ postId, onSubmit, parentReviewId }) => {
  const [inputContent, setInputContent] = useState('');
  const [error, setError] = useState('');

  const queryClient = useQueryClient();
  const auth = useAuth();
  const { id, avatar, username } = auth.currentUser;

  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (inputContent.trim().length === 0) {
      setError('Review cannot be empty');
      return;
    }

    // const response = await createReview(postId, inputContent, parentReviewId ?? null);
    const response = await dispatch(
      createReview({ postId, content: inputContent, parentReview: parentReviewId ?? null }),
    ).then(() => {
      queryClient.invalidateQueries();
    });

    // if (!response.data) {
    //   setError('Error creating review');
    // }
    // console.dir(response);
    // const { _id, username, src, content } = response;

    // if (onSubmit) {
    //   onSubmit({ _id, postId, content, username, src, parentReviewId });
    // }
    setInputContent('');
    setError('');
  };

  return (
    <HStack align="start" spacing="2" width="100%">
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
  );
};

export default ReviewForm;
