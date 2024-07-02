import {
  Card,
  CardBody,
  CardBodyProps,
  CardFooter,
  CardFooterProps,
  CardHeader,
  CardHeaderProps,
  Heading,
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
    const post = posts[index!]; // Get post data from redux state

    const { id } = auth.currentUser;
    const [loading, setLoading] = useState(false);
    // const [isVisible, setIsVisible] = useState(
    // !post.hiddenTo?.includes(id) &&
    //   (post.privacy === 'public' ||
    //     post.privacy === 'friend' ||
    //     (post.privacy === 'private' && post.author.id === id)),
    // );

    // useEffect(() => {
    //   setIsVisible(
    //     () =>
    //       (!post.hiddenTo?.includes(id) && post.privacy === 'public') ||
    //       post.privacy === 'friend' ||
    //       (post.privacy === 'private' && post.author.id === id),
    //   );
    // }, [auth.currentUser.id, post, setIsVisible]);

    // all hidden posts are stricttly hidden

    return (
      <Card
        {...containerProps}
        ref={ref}
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
          {post.media.length > 0 && <ImageSlider action="direct" slides={post.media} postId={postId} />}
        </CardBody>
        <CardFooter {...footerProps}>
          <PostFooter index={index} postId={post.id} setLoading={setLoading} />
        </CardFooter>
      </Card>
    );
  },
);

export default Post;
