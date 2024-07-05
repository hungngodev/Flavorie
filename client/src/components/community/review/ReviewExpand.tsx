import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { selectPostById, updatePost } from '../../../slices/posts/PostState';
import { selectCreateReviewStatus } from '../../../slices/reviews/CreateReview';
import { createReviewRequest } from '../../../slices/reviews/index';
import { AppDispatch, RootState } from '../../../store/store';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { ReviewExpandProps } from './types';

const ReviewExpand: React.FC<ReviewExpandProps> = ({ onClose, isOpen, postId, reviews, postData }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const post = useSelector((state: RootState) => selectPostById(postId)(state));

  const queryClient = useQueryClient();

  const dispatch = useDispatch<AppDispatch>();

  const createReviewStatus = useSelector(selectCreateReviewStatus);

  const submitReview = async (content: string) => {
    setLoading(true);

    if (!postId) {
      setError("We couldn't find the post");
      return;
    }

    if (!content) {
      setError('Review cannot be empty');
      return;
    }

    await dispatch(createReviewRequest({ postId: postId, content: content, parentReview: null }))
      .then((res: any) => {
        dispatch(updatePost({ post: res.data }));
        queryClient.invalidateQueries();
      })
      .then(() => {
        setLoading(false);
        setError('');
      });
  };
  useEffect(() => {
    console.log(createReviewStatus);
    if (createReviewStatus === 'loading') {
      setLoading(() => true);
    }
    if (createReviewStatus === 'succeeded' || createReviewStatus === 'idle') {
      setLoading(() => false);
    }
  }, [createReviewStatus, post, dispatch]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInRight" size="xl" blockScrollOnMount={false}>
      <ModalOverlay />
      <ModalContent
        marginBlock="auto"
        minWidth="65dvw"
        width="max-content"
        minHeight="70dvh"
        maxHeight="100%"
        backdropBlur={loading && 'blur(20px)'}
        pointerEvents={loading ? 'none' : 'auto'}
        opacity={loading ? 0.5 : 1}
      >
        <ModalHeader>{`${post?.author.name ?? postData?.author.name}'s reviews`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflow="auto">
          <VStack gap={4} width="100%" alignItems="start">
            {reviews?.map((review) => <ReviewCard review={review} postId={postId} />)}
          </VStack>
          {error && <Text>{error}</Text>}
        </ModalBody>

        <ModalFooter>
          <ReviewForm action="create" postId={postId} parentReviewId={null} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default ReviewExpand;
