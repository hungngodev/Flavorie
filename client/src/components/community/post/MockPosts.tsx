import { z } from 'zod';


const BaseObject = z
  .object({
    id: z.string().optional(),
    author: z.object({
      id: z.string().optional(),
      avatar: z.string().optional(),
      name: z.string(),
    }),
    body: z.string().optional(),
  })
  .required();

export const MediaObject = z
  .object({
    type: z.enum(['image', 'video']),
    url: z.string(),
    metadata: z.array(z.string()).optional(),
    description: z.string().optional(),
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
  postid: z.string(),
  reviews: z.lazy(() => ReviewObject.array()),
  media: z.array(MediaObject).optional(),
});

export const PostObject = BaseObject.extend({
  //id: z.string().optional(),
  //author: z.object({
  //  id: z.string().optional(),
  //  location: z.string().optional(),
  //  avatar: z.string().optional(),
  //  name: z.string(),
  //}),
  header: z.string(),
  // body: z.string().optional(),
  media: z.array(MediaObject),
  location: z.string(),
  privacy: z.enum(['public', 'private', 'friend']),
  reviews: z.array(ReviewObject),
  reacts: z.array(ReactObject),
  shares: z.array(z.string()),
  date: z.date(),
}).required({
  author: true,
  header: true,
  body: true,
});

export type MediaObjectType = z.infer<typeof MediaObject>;
export type PostObjectType = z.infer<typeof PostObject>;

// Define the mock data array
export const MockPosts: Array<PostObjectType> = [
  {
    id: 'post1',
    author: {
      avatar: 'https://github.com/shadcn.png',
      name: 'Vienhere',
    },
    header: 'Delicious Homemade Pizza',
    body: 'Tried a new recipe for homemade pizza and it turned out amazing! The crust is crispy, and the cheese is perfectly melted. Highly recommend giving this a try.',
    media: [
      {
        type: 'image',
        url: 'https://images.pexels.com/photos/25315989/pexels-photo-25315989/free-photo-of-paintings-of-cats-eye-and-a-cat.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        metadata: ['homemade', 'pizza', 'cheese'],
      },
      {
        type: 'image',
        url: 'https://i.pinimg.com/564x/1e/df/24/1edf24e5c5b046d576aecef67c6f5fd1.jpg',
        metadata: ['homemade', 'pizza', 'cheese'],
      },
      {
        type: 'image',
        url: 'https://i.pinimg.com/564x/1e/df/24/1edf24e5c5b046d576aecef67c6f5fd1.jpg',
        metadata: ['homemade', 'pizza', 'cheese'],
      },
      {
        type: 'image',
        url: 'https://i.pinimg.com/564x/1e/df/24/1edf24e5c5b046d576aecef67c6f5fd1.jpg',
        metadata: ['homemade', 'pizza', 'cheese'],
      },

      {
        type: 'image',
        url: 'https://i.pinimg.com/564x/90/e0/6f/90e06fbd8b13a89af70a62b61161431c.jpg',
        metadata: ['homemade', 'pizza', 'cheese'],
      },
    ],
    location: 'New York, USA',
    privacy: 'public',
    reviews: [
      {
        id: 'review1',
        author: {
          avatar: 'https://github.com/shadcn.png',
          name: 'user2',
        },
        body: 'This looks delicious!',
        reacts: [
          {
            id: 'react1',
            author: {
              avatar: 'https://github.com/shadcn.png',
              name: 'user3',
            },
            body: 'like',
          },
        ],
        reviews: [],
      },
    ],
    reacts: [
      {
        id: 'react2',
        author: {
          avatar: 'https://github.com/shadcn.png',
          name: 'user4',
        },
        body: 'like',
      },
    ],
    shares: ['user5', 'user6'],
    date: new Date(),
  },
  {
    id: 'post2',
    author: {
      avatar: 'https://github.com/shadcn.png',
      name: 'user3',
    },
    header: 'Quick and Easy Pasta',
    body: 'Whipped up a quick pasta dish for dinner tonight. Super simple but packed with flavor. Used fresh basil and garlic for an extra kick.',
    media: [
      {
        type: 'image',
        url: 'https://i.pinimg.com/564x/3a/70/7b/3a707b7160f5ec185f8f917872dfb8b6.jpg',
        metadata: ['vegan', 'chocolate', 'dessert'],
      },
      {
        type: 'image',
        url: 'https://i.pinimg.com/564x/3a/70/7b/3a707b7160f5ec185f8f917872dfb8b6.jpg',
        metadata: ['vegan', 'chocolate', 'dessert'],
      },
      {
        type: 'image',
        url: 'https://i.pinimg.com/564x/3a/70/7b/3a707b7160f5ec185f8f917872dfb8b6.jpg',
        metadata: ['vegan', 'chocolate', 'dessert'],
      },
      {
        type: 'image',
        url: 'https://i.pinimg.com/564x/3a/70/7b/3a707b7160f5ec185f8f917872dfb8b6.jpg',
        metadata: ['vegan', 'chocolate', 'dessert'],
      },
      {
        type: 'image',
        url: 'https://i.pinimg.com/564x/3a/70/7b/3a707b7160f5ec185f8f917872dfb8b6.jpg',
        metadata: ['vegan', 'chocolate', 'dessert'],
      },
      {
        type: 'image',
        url: 'https://i.pinimg.com/564x/3a/70/7b/3a707b7160f5ec185f8f917872dfb8b6.jpg',
        metadata: ['vegan', 'chocolate', 'dessert'],
      },
    ],
    location: 'San Francisco, USA',
    privacy: 'friend',
    reviews: [
      {
        id: 'review2',
        author: {
          avatar: 'https://github.com/shadcn.png',
          name: 'user5',
        },
        body: 'I love quick recipes like this!',
        reacts: [
          {
            id: 'react3',
            author: {
              avatar: 'https://github.com/shadcn.png',
              name: 'user6',
            },
            body: 'like',
          },
        ],
        reviews: [],
      },
    ],
    reacts: [
      {
        id: 'react4',
        author: {
          avatar: 'https://github.com/shadcn.png',
          name: 'user7',
        },
        body: 'like',
      },
    ],
    shares: ['user8'],
    date: new Date(),
  },
  {
    id: 'post3',
    author: {
      avatar: 'https://github.com/shadcn.png',
      name: 'user4',
    },
    header: 'Vegan Chocolate Cake',
    body: 'Baked a vegan chocolate cake for the first time and it turned out so moist and rich! Perfect for any chocolate lover.',
    media: [
      {
        type: 'image',
        url: 'https://i.pinimg.com/564x/3a/70/7b/3a707b7160f5ec185f8f917872dfb8b6.jpg',
        metadata: ['vegan', 'chocolate', 'dessert'],
      },
    ],
    location: 'Austin, USA',
    privacy: 'public',
    reviews: [
      {
        id: 'review3',
        author: {
          avatar: 'https://github.com/shadcn.png',
          name: 'user8',
        },
        body: "This looks incredible! Can't believe it's vegan.",
        reacts: [
          {
            id: 'react5',
            author: {
              avatar: 'https://github.com/shadcn.png',
              name: 'user9',
            },
            body: 'like',
          },
        ],
        reviews: [],
      },
      {
        id: 'review4',
        author: {
          avatar: 'https://github.com/shadcn.png',
          name: 'user10',
        },
        body: 'I need this recipe!',
        reacts: [
          {
            id: 'react6',
            author: {
              avatar: 'https://github.com/shadcn.png',
              name: 'user11',
            },
            body: 'like',
          },
        ],
        reviews: [],
      },
    ],
    reacts: [
      {
        id: 'react7',
        author: {
          avatar: 'https://github.com/shadcn.png',
          name: 'user12',
        },
        body: 'like',
      },
    ],
    shares: ['user13', 'user14'],
    date: new Date(),
  },
  {
    id: 'post4',
    author: {
      avatar: 'https://github.com/shadcn.png',
      name: 'user5',
    },
    header: 'Fresh Summer Salad',
    body: 'This summer salad is a mix of fresh greens, strawberries, and a light vinaigrette. Perfect for a hot day!',
    media: [
      {
        type: 'image',
        url: 'https://i.pinimg.com/564x/3a/70/7b/3a707b7160f5ec185f8f917872dfb8b6.jpg',
        metadata: ['salad', 'summer', 'healthy'],
      },
    ],
    location: 'Miami, USA',
    privacy: 'private',
    reviews: [],
    reacts: [
      {
        id: 'react8',
        author: {
          avatar: 'https://github.com/shadcn.png',
          name: 'user15',
        },
        body: 'like',
      },
    ],
    shares: ['user16'],
    date: new Date(),
  },
  {
    id: 'post5',
    author: {
      avatar: 'https://github.com/shadcn.png',
      name: 'user6',
    },
    header: 'Spicy Tacos',
    body: 'Made some spicy tacos with homemade salsa. They have just the right amount of heat and are incredibly flavorful!',
    media: [
      {
        type: 'image',
        url: 'https://i.pinimg.com/564x/3a/70/7b/3a707b7160f5ec185f8f917872dfb8b6.jpg',
        metadata: ['tacos', 'spicy', 'mexican'],
      },
    ],
    location: 'Los Angeles, USA',
    privacy: 'public',
    reviews: [
      {
        id: 'review5',
        author: {
          avatar: 'https://github.com/shadcn.png',
          name: 'user17',
        },
        body: 'These look fantastic! Love spicy food.',
        reacts: [
          {
            id: 'react9',
            author: {
              avatar: 'https://github.com/shadcn.png',
              name: 'user18',
            },
            body: 'like',
          },
        ],
        reviews: [],
      },
    ],
    reacts: [
      {
        id: 'react10',
        author: {
          avatar: 'https://github.com/shadcn.png',
          name: 'user19',
        },
        body: 'like',
      },
    ],
    shares: ['user20'],
    date: new Date(),
  },
];
