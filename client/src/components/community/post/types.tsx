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

export const MediaObject = z.object({
    type: z.enum(['image', 'video']),
    url: z.string(),
    file: z.instanceof(File).optional(),
    metadata: z.array(z.any()),
    description: z.string(),
});

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
    hiddenTo: z.array(z.string()).optional(),
    reacts: z.array(z.string()).optional(),
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
    react: z.array(z.string()),
    hiddenTo: z.array(z.string()),
    // review: z.array(ReviewObject.extend({ _id: z.string() })),
    // reactCount: z.number(),
    // reviewCount: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),
    _v: z.number(),
});

export const PostRequest = z.object({
    header: z.string().min(10, 'Title must be at least 10 characters').max(100, 'Title must not exceed 100 characters'),
    body: z.string().min(1, 'Body is required'),
    media: z.array(z.object({ file: z.instanceof(File) })),
    privacy: z.enum(['public', 'private', 'friend']),
    location: z.string(),
});

export const PostEditObject = PostRequest.extend({
    savedPreviewMedia: z.array(MediaObject).optional(),
});

export type PostRequestType = z.infer<typeof PostRequest>;

export type MediaObjectType = z.infer<typeof MediaObject>;

export type PostObjectType = z.infer<typeof PostObject>;

export type PostResponseObjectType = z.infer<typeof PostResponseObject>;

export type PostEditObjectType = z.infer<typeof PostEditObject>;

export interface BasePostProps {
    postId: string;
    postIndex: number;
    postData?: PostObjectType;
}

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
        hiddenTo: post.hiddenTo,
        location: post.location,
        privacy: post.privacy,
        reviews: [],
        reacts: post.react,
        date: post.createdAt,
    }));
    return frontEndPosts;
};
