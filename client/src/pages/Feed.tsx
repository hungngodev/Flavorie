import { Box } from '@chakra-ui/react';
import { QueryClient, useInfiniteQuery } from '@tanstack/react-query';
import lottie from 'lottie-web';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDispatch, useSelector } from 'react-redux';
import { Params } from 'react-router-dom';
import dumbCatLoaderAnimation from '../assets/animations/dumb-cat-loader.json';
import Post from '../components/community/post/Post';
import PostFormCard from '../components/community/post/form/PostFormCard';
import { PostObjectType, PostResponseObjectType, parsePost } from '../components/community/post/types';
import { useAuth } from '../hooks/index';
import '../index.css';
import { getFeed, selectPosts } from '../slices/posts/PostState';
import { AppDispatch } from '../store/store';
import customFetch from '../utils/customFetch';

const fetchFeed = async ({
  pageParam = 1,
}: {
  pageParam: number;
}): Promise<{ data: PostResponseObjectType[]; currentPage: number; nextPage: number | null }> => {
  const fetch = await customFetch.get(`/community/feed?page=${pageParam}&limit=5`);
  return {
    data: fetch.data.posts,
    currentPage: pageParam,
    nextPage: pageParam + 1,
  };
};

export const loader =
  (queryClient: QueryClient) =>
  () =>
  async ({ params }: { params: Params }) => {
    queryClient.ensureQueryData({
      queryKey: ['newsfeed'],
      queryFn: async () => await customFetch.get(`/community/feed?page=1&limit=5`),
    });
  };

const Feed = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<PostObjectType[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const postsState = useSelector(selectPosts);
  const { ref, inView, entry } = useInView({
    threshold: 0.5,
  })!;

  const { data, error, status, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['newsfeed'],
    queryFn: fetchFeed,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const updateFeed = async () => {
      console.log(data);
      if (status === 'success' && data) {
        const postload = data?.pages.flatMap((page) => parsePost(page.data));
        await dispatch(getFeed({ posts: postload }));
      }
    };
    updateFeed();
  }, [data, fetchNextPage, status, fetchNextPage, dispatch]);

  // useEffect(() => {
  //   // console.log('postsState', postsState);
  //   setPosts(postsState);
  // }, [postsState]);

  useEffect(() => {
    lottie.loadAnimation({
      animationData: dumbCatLoaderAnimation,
      autoplay: true,
      container: animationRef.current!,
      loop: true,
      renderer: 'svg',
    });
  }, [isFetchingNextPage]);

  const { currentUser } = useAuth();

  return (
    <Box
      // ref={parentRef}
      width="100%"
      height="100dvh"
      overflow="auto"
      backgroundColor="blackAlpha.50"
      paddingX={{ base: 0, lg: '10%', xl: '20%' }}
    >
      <PostFormCard />

      {status === 'pending' ? (
        <div>Loading...</div>
      ) : status === 'error' || isError ? (
        <div>{`Chill buddy we are out of post : (`}</div>
      ) : (
        <Box>
          {postsState.map((post, index) => (
            <Post key={post.id} postId={post.id} postData={post} index={index} className={`index-${index}`} />
          ))}
          {isFetchingNextPage && (
            <Box
              marginInline="auto"
              maxWidth={{ base: '100%', md: '80%', lg: '60%' }}
              marginBlock={4}
              ref={animationRef}
              id="animation-container"
            ></Box>
          )}
        </Box>
      )}
      <Box ref={ref} height="1px"></Box>
    </Box>
  );
};

export default Feed;
