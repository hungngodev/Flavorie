import { z } from 'zod';

// Define your schemas
const BaseObject = z
  .object({
    id: z.string(),
    author: z.string(),
    body: z.string(),
  })
  .required({ author: true });

export const ReactObject = BaseObject.extend({
  body: z.enum(['like', 'dislike']),
});

const BaseReview = BaseObject.extend({
  reacts: z.array(ReactObject),
});

type ReviewType = z.infer<typeof BaseReview> & {
  reviews: ReviewType[];
};

// recursively define a Review
export const ReviewObject: z.ZodType<ReviewType> = BaseReview.extend({
  reviews: z.lazy(() => ReviewObject.array()),
});

export const MediaObject = z.object({
  type: z.enum(['image', 'video', 'file']),
  url: z.string(),
  metadata: z.array(z.string()),
});

export const PostObject = BaseObject.extend({
  header: z.string(),
  media: z.array(MediaObject),
  location: z.string(),
  privacy: z.enum(['public', 'private', 'friend']),
  reviews: z.array(ReviewObject),
  reacts: z.array(ReactObject),
  shares: z.array(z.string()),
}).required({
  author: true,
  header: true,
  body: true,
});

export const MockPosts: Array<z.infer<typeof PostObject>> = [
  {
    id: 'post1',
    author: 'user1',
    header: 'Delicious Homemade Pizza',
    body: 'Tried a new recipe for homemade pizza and it turned out amazing! The crust is crispy, and the cheese is perfectly melted. Highly recommend giving this a try.',
    media: [
      {
        type: 'image',
        url: 'https://example.com/images/pizza.jpg',
        metadata: ['homemade', 'pizza', 'cheese'],
      },
    ],
    location: 'New York, USA',
    privacy: 'public',
    reviews: [
      {
        id: 'review1',
        author: 'user2',
        body: 'This looks delicious!',
        reacts: [
          {
            id: 'react1',
            author: 'user3',
            body: 'like',
          },
        ],
        reviews: [],
      },
    ],
    reacts: [
      {
        id: 'react2',
        author: 'user4',
        body: 'like',
      },
    ],
    shares: ['user5', 'user6'],
  },
  {
    id: 'post2',
    author: 'user3',
    header: 'Quick and Easy Pasta',
    body: 'Whipped up a quick pasta dish for dinner tonight. Super simple but packed with flavor. Used fresh basil and garlic for an extra kick.',
    media: [
      {
        type: 'video',
        url: 'https://example.com/videos/pasta.mp4',
        metadata: ['pasta', 'quick meal', 'dinner'],
      },
    ],
    location: 'San Francisco, USA',
    privacy: 'friend',
    reviews: [
      {
        id: 'review2',
        author: 'user5',
        body: 'I love quick recipes like this!',
        reacts: [
          {
            id: 'react3',
            author: 'user6',
            body: 'like',
          },
        ],
        reviews: [],
      },
    ],
    reacts: [
      {
        id: 'react4',
        author: 'user7',
        body: 'like',
      },
    ],
    shares: ['user8'],
  },
  {
    id: 'post3',
    author: 'user4',
    header: 'Vegan Chocolate Cake',
    body: 'Baked a vegan chocolate cake for the first time and it turned out so moist and rich! Perfect for any chocolate lover.',
    media: [
      {
        type: 'image',
        url: 'https://example.com/images/chocolate-cake.jpg',
        metadata: ['vegan', 'chocolate', 'dessert'],
      },
    ],
    location: 'Austin, USA',
    privacy: 'public',
    reviews: [
      {
        id: 'review3',
        author: 'user8',
        body: "This looks incredible! Can't believe it's vegan.",
        reacts: [
          {
            id: 'react5',
            author: 'user9',
            body: 'like',
          },
        ],
        reviews: [],
      },
      {
        id: 'review4',
        author: 'user10',
        body: 'I need this recipe!',
        reacts: [
          {
            id: 'react6',
            author: 'user11',
            body: 'like',
          },
        ],
        reviews: [],
      },
    ],
    reacts: [
      {
        id: 'react7',
        author: 'user12',
        body: 'like',
      },
    ],
    shares: ['user13', 'user14'],
  },
  {
    id: 'post4',
    author: 'user5',
    header: 'Fresh Summer Salad',
    body: 'This summer salad is a mix of fresh greens, strawberries, and a light vinaigrette. Perfect for a hot day!',
    media: [
      {
        type: 'image',
        url: 'https://example.com/images/summer-salad.jpg',
        metadata: ['salad', 'summer', 'healthy'],
      },
    ],
    location: 'Miami, USA',
    privacy: 'private',
    reviews: [],
    reacts: [
      {
        id: 'react8',
        author: 'user15',
        body: 'like',
      },
    ],
    shares: ['user16'],
  },
  {
    id: 'post5',
    author: 'user6',
    header: 'Spicy Tacos',
    body: 'Made some spicy tacos with homemade salsa. They have just the right amount of heat and are incredibly flavorful!',
    media: [
      {
        type: 'image',
        url: 'https://example.com/images/tacos.jpg',
        metadata: ['tacos', 'spicy', 'mexican'],
      },
    ],
    location: 'Los Angeles, USA',
    privacy: 'public',
    reviews: [
      {
        id: 'review5',
        author: 'user17',
        body: 'These look fantastic! Love spicy food.',
        reacts: [
          {
            id: 'react9',
            author: 'user18',
            body: 'like',
          },
        ],
        reviews: [],
      },
    ],
    reacts: [
      {
        id: 'react10',
        author: 'user19',
        body: 'like',
      },
    ],
    shares: ['user20'],
  },
];
