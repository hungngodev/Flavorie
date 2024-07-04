import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  VStack,
} from '@chakra-ui/react';
import React, { useState, useRef, useEffect, memo } from 'react';
import { BasePostProps } from '../post/types';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import { Params, useLocation, useParams } from 'react-router-dom';
import { CreateReview } from '../../../slices/reviews/CreateReview';
import { updatePost } from '../../../slices/posts/PostState';
import customFetch from '../../../utils/customFetch';
import { createReview } from '../../../slices/reviews/CreateReview';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { ReviewExpandProps } from './types';

const ReviewExpand: React.FC<ReviewExpandProps> = ({ onClose, isOpen, postId, postData, reviews }) => {
  console.log(postData);
  console.log(reviews);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const dispatch = useDispatch<AppDispatch>();

  const submitReview = async (content: string) => {
    if (!postId) {
      setError("We couldn't find the post");
    }
    setLoading(true);
    const res = await dispatch(createReview({ postId: postId, content: content, parentReview: null }))
      .then((res: any) => {
        dispatch(updatePost({ post: res.data }));
        queryClient.invalidateQueries();
      })
      .then(() => setLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInRight" size="xl" blockScrollOnMount={false}>
      <ModalOverlay />
      <ModalContent marginBlock="auto" minWidth="65dvw" maxHeight="100%">
        <ModalHeader>{`${postData?.author.name}'s reviews`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflow="auto">
          <VStack gap={4} width="100%" alignItems="start">
            {reviews?.map((review) => <ReviewCard review={review} />)}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <ReviewForm onSubmit={submitReview} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default ReviewExpand;
