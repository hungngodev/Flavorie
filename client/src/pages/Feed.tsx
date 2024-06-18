import { Box } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { z } from 'zod';
import { PostObjectType } from '../components/community/post/MockPosts';
import Post from '../components/community/post/Post';
import customFetch from '../utils/customFetch';

const style = {
  backgroundColor: 'gray.50',
};

const NewsFeedRequest = z.object({
  page: z.number().optional(),
  limits: z.number().optional(),
});
type NewsFeedRequestType = z.infer<typeof NewsFeedRequest>;

// function newsfeedLoader(page: any, limits: number = 10) {
//   return useQuery({
//     queryKey: ['newsfeed', page],
//     queryFn: async () => {
//       const request: NewsFeedRequestType = { page: page, limits: 10 };
//     },
//   });
// }

const Feed = () => {
  const { data, error, status, isError, fetchNextPage } = useInfiniteQuery({
    queryKey: ['newsfeed'],
    queryFn: async ({
      pageParam = 1,
    }: {
      pageParam: number;
    }): Promise<{ data: any[]; currentPage: number; nextPage: number | null }> => {
      const fetch = await customFetch.get(`/community/feed?page=${pageParam}&limit=10`);
      return {
        data: fetch.data.posts,
        currentPage: pageParam,
        nextPage: pageParam + 1,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  const parseData = (data: any) => {
    if (!data) return [];

    const newFeed: PostObjectType[] = data.map((post: any) => ({
      id: post._id,
      author: {
        id: post.author._id,
        name: post.author.name,
        location: post.author.location,
        avatar: post.author.avatar,
      },
      header: post.header,
      body: post.body,
      media: post.media.map((media: any) => ({
        type: media.type,
        url: media.url,
        metadata: media.metadata,
        description: media.description ?? 'Image of post',
      })),
      location: post.location,
      privacy: post.privacy,
      reviews: [],
      react: [],
      date: post.createdAt,
    }));
    return newFeed;
  };

  return (
    <Box
      width="100%"
      height="100%"
      overflow="auto"
      backgroundColor="blackAlpha.50"
      paddingX={{ base: 0, lg: '10%', xl: '20%' }}
    >
      {status === 'success' &&
        data?.pages.map((page) => {
          console.log(page);
          return parseData(page.data).map((post) => <Post key={post.id} postData={post} isDisplayed />);
        })}
      <div ref={ref}>Here</div>
    </Box>
  );
};
export default Feed;
