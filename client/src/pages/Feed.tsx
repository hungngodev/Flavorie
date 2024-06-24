import { Box, Text } from '@chakra-ui/react';
import { QueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef, useState } from 'react';
import { Params } from 'react-router-dom';
import Post from '../components/community/post/Post';
import PostFormCard from '../components/community/post/form/PostFormCard';
import { PostObjectType, PostResponseObjectType, parsePost } from '../components/community/post/types';
import { useAuth } from '../hooks/index';
import customFetch from '../utils/customFetch';
import { useDispatch, useSelector } from 'react-redux';
import { addPosts, selectPosts, selectPostsLength } from '../slices/posts/PostState';
import { AppDispatch, RootState } from '../store/store';
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
  // const [posts, setPosts] = useState<PostObjectType[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const posts = useSelector((state: RootState) => selectPosts(state));
  const postsLength = useSelector((state: RootState) => selectPostsLength(state));
  const { data, error, status, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['newsfeed'],
    queryFn: fetchFeed,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const scrollVirtualizer = useVirtualizer({
    count: postsLength,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => 400,
    gap: 50,
    getItemKey: (index) => posts[index].id,
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

    if (lastItem.index >= postsLength - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage, postsLength, isFetchingNextPage, scrollVirtualizer.getVirtualItems()]);

  useEffect(() => {
    if (status === 'success' && data) {
      const postload = data?.pages.flatMap((page) => parsePost(page.data));
      dispatch(addPosts(postload));
    }
  }, [data, fetchNextPage, status]);

  const { currentUser } = useAuth();

  return (
    <Box
      ref={parentRef}
      width="100%"
      height="100dvh"
      overflow="auto"
      backgroundColor="blackAlpha.50"
      paddingX={{ base: 0, lg: '10%', xl: '20%' }}
    >
      <PostFormCard />
      <Box width="100%" position="relative" height={`${scrollVirtualizer.getTotalSize()}px`}>
        {scrollVirtualizer.getVirtualItems().map((virtualItem) => {
          const isLoaderRow = virtualItem.index > postsLength - 1;
          const post = posts[virtualItem.index];
          return isLoaderRow ? (
            hasNextPage ? (
              <Text>Loading...</Text>
            ) : (
              <Text>{'We ran out of posts :('}</Text>
            )
          ) : (
            <Post
              ref={scrollVirtualizer.measureElement}
              data-index={virtualItem.index}
              position="absolute"
              top={0}
              transform={`translateY(${virtualItem.start}px)`}
              key={virtualItem.key}
              postData={post}
              isDisplayed={true}
              marginInline="auto"
              width="100%"
              height="auto"
              index={virtualItem.index}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default Feed;
