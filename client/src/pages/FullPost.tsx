import { Box, Card, CardBody, CardFooter, CardHeader, Heading, Text, VStack } from '@chakra-ui/react';
import { QueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Params, useLocation, useParams } from 'react-router-dom';
import { ImageSlider, PostFooter, PostHeader } from '../components/community/post/index';
import { PostEditObjectType } from '../components/community/post/types';
import customFetch from '../utils/customFetch';
const postQuery = (postId: string) => {
  return {
    queryKey: ['community-post', postId],
    queryFn: async () => {
      const request = await customFetch.get(`/community/post/${postId}`);
      console.log(request);
      return request.data;
    },
  };
};

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: { params: Params }) => {
    queryClient.ensureQueryData(postQuery(params.postId ?? ''));
    return null;
  };

const FullPost = () => {
  const [loading, setLoading] = useState(false);

  const { postId } = useParams();
  // const { data: queryData, status } = useQuery<any>(postQuery(postId ?? ''));
  const { search, state } = useLocation();
  const searchParams = new URLSearchParams(search);
  const index = parseInt(searchParams.get('index') ?? '-1');

  const { post } = state;
  console.log('post');
  console.log(post);
  console.log('index');
  console.log(index);
  console.log('postId');
  console.log(postId);
  // console.log('queryData');
  // console.log(queryData);

  const [preloadPost, setPreloadPost] = useState<PostEditObjectType>({
    header: post?.header ?? '',
    body: post?.body ?? '',
    privacy: post?.privacy ?? 'public',
    location: post?.location ?? '',
    media: [],
    savedPreviewMedia: post?.media ?? [],
  });

  useEffect(() => {
    setPreloadPost(() => ({
      header: post?.header ?? '',
      body: post?.body ?? '',
      privacy: post?.privacy ?? 'public',
      location: post?.location ?? '',
      media: [],
      savedPreviewMedia: post?.media ?? [],
    }));
  }, [postId, post]);

  return status === 'pending' ? (
    <Box>Loading...</Box>
  ) : status === 'error' || !post || index === -1 ? (
    <div>Error</div>
  ) : (
    <Card height="auto" position="relative">
      <CardHeader paddingBottom={0}>
        <PostHeader
          isFullPage={true}
          postId={postId ?? post.id ?? ''}
          postIndex={index}
          preloadData={preloadPost}
          postData={post}
        />
      </CardHeader>

      <CardBody>
        <VStack gap={2} alignItems="start" marginBottom={2}>
          <Heading size="lg">{post.header}</Heading>
          <Text>{post.body}</Text>
        </VStack>
        {post.media.length > 0 && (
          <ImageSlider postIndex={index} action="direct" slides={post.media} postId={postId ?? post.id ?? ''} />
        )}
      </CardBody>
      <CardFooter>
        <PostFooter postId={postId ?? post.id ?? ''} postIndex={index} postData={post} />
      </CardFooter>
    </Card>
  );
};
export default FullPost;
