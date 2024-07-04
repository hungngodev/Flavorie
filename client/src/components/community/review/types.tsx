import { z } from 'zod';
import { PersonalProps } from '../../users/InfoCard';
import { PostResponseObjectType, BasePostProps } from '../post/types';

export type Review = {
  id: string;
  postId: string;
  author: {
    id: string;
    avatar: string;
    name: string;
  };
  content: string;
  children: Review[];
};

export interface ReviewCardProps {
  review: Review;
}

export interface ReviewExpandProps extends BasePostProps {
  reviews: Review[] | undefined;
  onClose: (arg?: any) => void;
  isOpen: boolean;
}

export const ReviewRequest = z
  .object({
    content: z.string().nonempty(),
    parentReview: z.string().nullable(),
    postId: z.string(),
  })
  .required({ content: true, postId: true });

export function parseReviews(backendReviews: any[]): Review[] {
  function parseReview(review: any): Review {
    return {
      id: review._id,
      postId: review.postId,
      author: {
        id: review.userId._id,
        avatar: review.userId.avatar,
        name: review.userId.name,
      },
      content: review.content,
      children: review.childrenReview.map(parseReview),
    };
  }

  return backendReviews.map(parseReview);
}

export type ReviewRequestType = z.infer<typeof ReviewRequest>;
