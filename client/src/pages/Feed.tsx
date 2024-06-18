import { Box } from '@chakra-ui/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { PostObjectType, PostResponseObjectType } from '../components/community/post/MockPosts';
import Post from '../components/community/post/Post';
import customFetch from '../utils/customFetch';

const Feed = () => {
  const [posts, setPosts] = useState<PostObjectType[]>([]);
  const { data, error, status, isError, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['newsfeed'],
    queryFn: async ({
      pageParam = 1,
    }: {
      pageParam: number;
    }): Promise<{ data: PostResponseObjectType[]; currentPage: number; nextPage: number | null }> => {
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

  useEffect(() => {
    if (status === 'success' && data) {
      const postload = data?.pages.flatMap((page) => parsePost(page.data));
      setPosts(postload ?? []);
    }
  }, [data]);

  // convert backend data to frontend data
  const parsePost = (backEndPosts: PostResponseObjectType[]) => {
    if (!data) return [];

    const frontEndPosts: PostObjectType[] = backEndPosts.map((post: any) => ({
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
      reacts: [],
      date: post.createdAt,
    }));
    return frontEndPosts;
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
        posts.map((post) => {
          return <Post key={post.id} postData={post} isDisplayed />;
        })}
      <Box ref={ref} height="1px"></Box>
    </Box>
  );
};
export default Feed;
