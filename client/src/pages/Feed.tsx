import { AspectRatio, Box, Image } from '@chakra-ui/react';
import { QueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Params } from 'react-router-dom';
import errorIllustration from '../../public/images/404-error-removebg-preview.png';
import dumbCatLoaderAnimation from '../assets/animations/dumb-cat-loader.json';
import Post from '../components/community/post/Post';
import PostFormCard from '../components/community/post/form/PostFormCard';
import { PostResponseObjectType, parsePost } from '../components/community/post/types';
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

  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector(selectPosts);

  const { data, error, status, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['newsfeed'],
    queryFn: fetchFeed,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    retry: 5,
    retryDelay: 3000,
  });

  const scrollVirtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => 200,
    gap: 30,
    getItemKey: (index) => posts[index]?.id,
    measureElement: (element, entry, instance) => {
      const direction = instance.scrollDirection;
      if (instance.isScrolling && direction && direction === 'backward') {
        const indexKey = Number(element.getAttribute('data-index'));
        let cacheMeasurement = instance.measurementsCache[indexKey].size;
        return Math.max(cacheMeasurement, element.getBoundingClientRect().height);
      }

      return element.getBoundingClientRect().height;
    },
  });

  useEffect(() => {
    const [lastItem] = [...scrollVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (lastItem.index >= posts.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, posts, isFetchingNextPage, scrollVirtualizer.getVirtualItems()]);

  useEffect(() => {
    const updateFeed = async () => {
      if (status === 'success' && data) {
        const postload = data?.pages.flatMap((page) => parsePost(page.data));
        await dispatch(getFeed({ posts: postload }));
      }
    };

    updateFeed();
  }, [data, fetchNextPage, status, fetchNextPage, dispatch]);

  useEffect(() => {
    lottie.loadAnimation({
      animationData: dumbCatLoaderAnimation,
      autoplay: true,
      container: animationRef.current!,
      loop: true,
      renderer: 'svg',
    });
  }, [isFetchingNextPage]);

  return (
    <Box
      ref={parentRef}
      width="100%"
      height="100dvh"
      overflow="auto"
      backgroundColor="blackAlpha.50"
      paddingX={{ base: 0, lg: '10%', xl: '20%' }}
      id="parentRef"
    >
      <PostFormCard />

      <Box width="100%" position="relative" height={`${scrollVirtualizer.getTotalSize()}px`}>
        {scrollVirtualizer.getVirtualItems().map((virtualItem) => {
          const isLoaderRow = virtualItem.index > posts.length - 1;
          const post = posts[virtualItem.index];
          return post ? (
            <Post
              ref={scrollVirtualizer.measureElement}
              data-index={virtualItem.index}
              position="absolute"
              top={0}
              transform={`translateY(${virtualItem.start}px)`}
              h="auto"
              key={virtualItem.key}
              postData={post}
              marginInline="auto"
              width="100%"
              postId={post.id}
            />
          ) : null;
        })}
      </Box>
      {isFetchingNextPage && !isError && hasNextPage && !error && (
        <Box
          marginInline="auto"
          maxWidth={{ base: '100%', md: '80%', lg: '60%' }}
          marginBlock={4}
          ref={animationRef}
          id="animation-container"
        />
      )}
      {(error || isError || !hasNextPage) && !isFetchingNextPage && (
        <AspectRatio marginInline="auto" maxWidth={{ base: '100%', md: '90%', lg: '85%' }} ratio={4 / 3}>
          <Image src={errorIllustration} alt="error-image" />
        </AspectRatio>
      )}
    </Box>
  );
};

export default Feed;
