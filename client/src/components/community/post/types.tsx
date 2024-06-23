import { z } from 'zod';

const BaseObject = z
  .object({
    id: z.string().optional(),
    author: z.object({
      name: z.string(),
      id: z.string().optional(),
      avatar: z.string().optional(),
    }),
    body: z.string().optional(),
  })
  .required();

export const MediaObject = z
  .object({
    type: z.enum(['image', 'video']),
    url: z.string(),
    file: z.instanceof(File).optional(),
    metadata: z.array(z.any()),
    description: z.string(),
  })
  .required({ type: true, url: true });

export const ReactObject = BaseObject.extend({
  body: z.enum(['like', 'dislike']),
});

const BaseReview = BaseObject.extend({
  reacts: z.array(ReactObject),
});

type ReviewType = z.infer<typeof BaseReview> & {
  reviews: ReviewType[];
};

export const ReviewObject: z.ZodType<ReviewType> = BaseReview.extend({
  //id: z.string().optional(),
  //author: z.object({
  //  id: z.string().optional(),
  //  location: z.string().optional(),
  //  avatar: z.string().optional(),
  //  name: z.string(),
  //}),
  // body: z.string().optional(),
  postid: z.string().optional(),
  reviews: z.lazy(() => ReviewObject.array()),
  media: z.array(MediaObject).optional(),
});

const Privacy = z.enum(['public', 'private', 'friend']);

// schema for front end post
export const PostObject = BaseObject.extend({
  //id: z.string().optional(),
  //author: z.object({
  //  id: z.string().optional(),
  //  avatar: z.string().optional(),
  //  name: z.string(),
  //}),
  header: z.string(),
  // body: z.string().optional(),
  media: z.array(MediaObject),
  location: z.string(),
  privacy: Privacy,
  reviews: z.array(ReviewObject).optional(),
  reacts: z.array(ReactObject).optional(),
  shares: z.array(z.string()).optional(),
  date: z.date().optional(),
}).required({
  author: true,
  header: true,
  body: true,
});

// schema for back end post
export const PostResponseObject = z.object({
  _id: z.string(),
  author: z.object({
    _id: z.string(),
    name: z.string(),
    avatar: z.string(),
  }),
  header: z.string(),
  body: z.string(),
  location: z.string(),
  privacy: Privacy,
  media: z.array(MediaObject.extend({ _id: z.string() })),
  reactCount: z.number(),
  reviewCount: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _v: z.number(),
});

export type MediaObjectType = z.infer<typeof MediaObject>;
export type PostObjectType = z.infer<typeof PostObject>;
export type PostResponseObjectType = z.infer<typeof PostResponseObject>;

export const parsePost = (backEndPosts: PostResponseObjectType[]) => {
  if (!backEndPosts) return [];

  const frontEndPosts: PostObjectType[] = backEndPosts.map((post: PostResponseObjectType) => ({
    id: post._id,
    author: {
      id: post.author._id,
      name: post.author.name,
      avatar: post.author.avatar,
    },
    header: post.header,
    body: post.body,
    media: post.media.map((media: MediaObjectType) => ({
      type: media.type,
      url: media.url,
      metadata: media.metadata,
      description: media.description ?? 'Image of post',
    })),
    location: post.location,
    privacy: post.privacy,
    reviews: [],
    reacts: [],
    date: post.createdAt,
  }));
  return frontEndPosts;
};
