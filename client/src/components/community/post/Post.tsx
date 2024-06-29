import {
  Card,
  CardBody,
  CardBodyProps,
  CardFooter,
  CardFooterProps,
  CardHeader,
  CardHeaderProps,
  Heading,
  Spinner,
  StackProps,
  Text,
  VStack,
  useTheme,
} from '@chakra-ui/react';
import { forwardRef, useState } from 'react';
import { useSelector } from 'react-redux';
import useAuth from '../../../hooks/useAuth';
import { selectPosts } from '../../../slices/posts/PostState';
import { ImageSlider, PostFooter, PostHeader } from './index';
import { BasePostProps, PostObjectType } from './types';

interface PostProps extends StackProps, BasePostProps {
  postData: PostObjectType;
  headerProps?: CardHeaderProps;
  bodyProps?: CardBodyProps;
  footerProps?: CardFooterProps;
}

const Post = forwardRef<HTMLDivElement, PostProps>(
  ({ postData, headerProps, bodyProps, footerProps, index, postId, ...containerProps }, ref) => {
    const theme = useTheme();

    const auth = useAuth();
    const posts = useSelector(selectPosts);
    const post = posts[index]; // Get post data from redux state

    const { id } = auth.currentUser;
    const [loading, setLoading] = useState(false);

    return (
      <Card
        marginBlock={4}
        {...containerProps}
        height="auto"
        ref={ref}
        position="relative"
        backdropBlur={loading && 'blur(10px)'}
        pointerEvents={loading ? 'none' : 'auto'}
        opacity={loading ? 0.5 : 1}
      >
        <CardHeader paddingBottom={0} {...headerProps}>
          <PostHeader postId={post.id} index={index} setLoading={setLoading} />
        </CardHeader>

        <CardBody {...bodyProps}>
          <VStack gap={2} alignItems="start" marginBottom={2}>
            <Heading size="lg">{post.header}</Heading>
            <Text>{post.body}</Text>
          </VStack>
          {post.media.length > 0 && <ImageSlider slides={post.media} />}
        </CardBody>
        <CardFooter {...footerProps}>
          <PostFooter index={index} postId={post.id} setLoading={setLoading} />
        </CardFooter>

        {loading && (
          <Spinner
            marginInline="auto"
            size="xl"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color={theme.colors.palette_indigo}
            position="absolute"
            top="50%"
            left="50%"
          />
        )}
      </Card>
    );
  },
);

export default Post;
