import { z } from 'zod';
import { PersonalProps } from '../../users/InfoCard';
import { PostResponseObjectType, BasePostProps } from '../post/types';

export const BaseReview = z.object({
  id: z.string(),
  postId: z.string(),
  userId: z.string(),
  author: z.object({
    id: z.string(),
    avatar: z.string(),
    name: z.string(),
  }),
  content: z.string(),
  timestamp: z.string(),
});

export type Review = z.infer<typeof BaseReview> & {
  children: Review[];
};

export const ReviewObject: z.ZodType<Review> = BaseReview.extend({
  children: z.lazy(() => ReviewObject.array()),
});

export type ReviewObjectType = z.infer<typeof ReviewObject>;

// export interface Review {
//   id: string;
//   postId: string;
//   userId: string;
//   author: {
//     id: string;
//     avatar: string;
//     name: string;
//   };
//   content: string;
//   timestamp: string;
//   children: Review[];
// }

// export const ReviewObject: z.ZodObject<Review> = z.lazy(() =>
//   z.object({
//     id: z.string(),
//     postId: z.string(),
//     userId: z.string(),
//     author: z.object({
//       id: z.string(),
//       avatar: z.string(),
//       name: z.string(),
//     }),
//     content: z.string(),
//     timestamp: z.string(),
//     children: z.array(ReviewObject),
//   }),
// );

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

export function parseReviews(backendReviews: any[]) {
  if (!backendReviews || backendReviews.length === 0) return;
  function parseReview(review: any): Review {
    return {
      id: review._id,
      userId: review.userId,
      postId: review.postId,
      author: {
        id: review.userId._id,
        avatar: review.userId.avatar,
        name: review.userId.name,
      },
      timestamp: review.createdAt,
      content: review.content,
      children: review.childrenReview.map(parseReview),
    };
  }

  return backendReviews.map(parseReview);
}

export type ReviewRequestType = z.infer<typeof ReviewRequest>;
