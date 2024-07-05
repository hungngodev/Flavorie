import { z } from 'zod';
import { BasePostProps } from '../post/types';

export const BaseReview = z.object({
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

export const BaseResponseReview = z.object({
  _id: z.string(),
  postId: z.string(),
  userId: z.object({
    _id: z.string(),
    avatar: z.string(),
    name: z.string(),
  }),
  content: z.string(),
  timestamp: z.string(),
});

export type FrontEndReview = z.infer<typeof BaseReview> & {
  id: string;
  children: FrontEndReview[];
};
export type BackendReview = z.infer<typeof BaseResponseReview> & {
  childrenReview: BackendReview[];
};

export const ReviewObject: z.ZodType<FrontEndReview> = BaseReview.extend({
  id: z.string(),
  children: z.lazy(() => ReviewObject.array()),
});

export const ReviewResponseObject: z.ZodType<BackendReview> = BaseResponseReview.extend({
  _id: z.string(),
  childrenReview: z.lazy(() => ReviewResponseObject.array()),
});

export type ReviewObjectType = z.infer<typeof ReviewObject>;

export type ReviewResponseType = z.infer<typeof ReviewResponseObject>;

export interface ReviewCardProps extends BasePostProps {
  review: ReviewObjectType;
}

export interface ReviewExpandProps extends BasePostProps {
  reviews: ReviewObjectType[] | undefined;
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

export function parseReviews(backendReviews: ReviewResponseType[]): ReviewObjectType[] {
  if (!backendReviews || backendReviews.length === 0) return [];
  function parseReview(review: ReviewResponseType): ReviewObjectType {
    return {
      id: review._id,
      userId: review.userId._id,
      postId: review.postId,
      author: {
        id: review.userId._id,
        avatar: review.userId.avatar,
        name: review.userId.name,
      },
      timestamp: review.timestamp,
      content: review.content,
      children: review.childrenReview.map(parseReview),
    };
  }

  return backendReviews.map(parseReview);
}

export type ReviewRequestType = z.infer<typeof ReviewRequest>;
