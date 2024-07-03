import { z } from 'zod';
import { PersonalProps } from '../../users/InfoCard';
import { PostResponseObjectType, ReviewObjectType } from '../post/types';

export type Review = {
  id: string;
  author: PersonalProps['avatar'];
  // {
  // src: string
  // username: string,
  //}
  content: string;
  children: Review[];
};

export interface ReviewCardProps {
  review: Review;
}

export const ReviewRequest = z
  .object({
    content: z.string().nonempty(),
    parentReview: z.string().nullable(),
    postId: z.string(),
  })
  .required({ content: true, postId: true });

export const parseReview = (reviews: any[]): Review[] => {
  return reviews.map((review: any) => {
    return {
      id: review._id,
      author: {
        name: review.userId.name,
        avatar: review.userId.avatar,
      },
      content: review.content,
      children: review.childrenReview,
    };
  });
};

export type ReviewRequestType = z.infer<typeof ReviewRequest>;
