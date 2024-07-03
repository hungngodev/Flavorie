import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
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
import { createReview } from '@/slices/reviews/CreateReview';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store/store';
import { ReviewExpandProps } from './types';

// const reviewQuery = (postId: string) => {
//   return {
//     queryKey: ['community-review', postId],
//     queryFn: async () => {
//       const request = await customFetch.get(`/community/post/${postId}`);
//       console.log(request.data);
//       return request.data;
//     },
//   };
// };

// export const loader =
//   (queryClient: QueryClient) =>
//   async ({ params }: { params: Params }) => {
//     queryClient.ensureQueryData(reviewQuery(params.postId ?? ''));
//     return null;
//   };

const ReviewExpand: React.FC<ReviewExpandProps> = ({ onClose, isOpen, postIndex, postId, postData }) => {
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
    <Modal isOpen={isOpen} onClose={onClose} motionPreset="slideInRight">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Your reviews</ModalHeader>
        <ModalCloseButton />
        {/* <ModalBody>{queryData && queryData?.review.map((item) => <ReviewCard />)}</ModalBody> */}

        <ModalFooter>
          <ReviewForm onSubmit={submitReview} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default ReviewExpand;
