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
} from '@chakra-ui/react';
import { forwardRef, memo, useState, useEffect } from 'react';
import { ImageSlider, PostHeader, PostFooter } from './index';
import { PostObjectType, PostEditObjectType, BasePostProps } from './types';
import useAuth from '../../../hooks/useAuth';

interface PostProps extends StackProps, BasePostProps {
  postData: PostObjectType;
  headerProps?: CardHeaderProps;
  bodyProps?: CardBodyProps;
  footerProps?: CardFooterProps;
}

const Post = memo(
  forwardRef<HTMLDivElement, PostProps>(
    ({ postData, headerProps, bodyProps, footerProps, index, ...containerProps }, ref) => {
      const auth = useAuth();
      const { id } = auth.currentUser;

      const [canUpdate, setCanUpdate] = useState(postData.author.id === id);
      const [isDisplayed, setIsDisplayed] = useState(postData.privacy === 'public');
      const [isLiked, setIsLiked] = useState(postData.reacts?.includes(id));

      const [preloadPost, setPreloadPost] = useState<PostEditObjectType>({
        header: postData.header ?? '',
        body: postData.body ?? '',
        privacy: postData.privacy ?? 'public',
        location: postData.location ?? '',
        media: [],
        savedPreviewMedia: postData.media ?? [],
      });

      useEffect(() => {
        setPreloadPost({
          header: postData.header ?? '',
          body: postData.body ?? '',
          privacy: postData.privacy ?? 'public',
          location: postData.location ?? '',
          media: [],
          savedPreviewMedia: postData.media ?? [],
        });
      }, [postData]);

      useEffect(() => {
        setCanUpdate(postData.author.id === id);
      }, [auth.currentUser, postData]);

      useEffect(() => {
        setIsDisplayed(postData.privacy === 'public');
      }, [postData]);

      useEffect(() => {
        setIsLiked(postData.reacts?.includes(id));
      }, [postData.reacts, id]);

      return (
        <>
          {isDisplayed && (
            <Card marginBlock={4} {...containerProps} height="auto" ref={ref}>
              <CardHeader paddingBottom={0} {...headerProps}>
                <PostHeader
                  avatar={postData.author.avatar}
                  author={postData.author.name}
                  date={postData.date}
                  privacy={postData.privacy}
                  location={postData.location}
                  index={index}
                  canUpdate={canUpdate}
                  preloadPost={preloadPost}
                  postId={postData.id}
                />
              </CardHeader>
              <CardBody {...bodyProps}>
                <VStack gap={2} alignItems="start" marginBottom={2}>
                  <Heading size="lg">{postData.header}</Heading>
                  <Text>{postData.body}</Text>
                </VStack>
                <ImageSlider slides={postData.media} />
              </CardBody>
              <CardFooter {...footerProps}>
                <PostFooter
                  isLiked={isLiked}
                  index={index}
                  postId={postData.id}
                  canUpdate={canUpdate}
                  reacts={postData.reacts}
                  reviews={postData.reviews}
                  shares={postData.shares}
                />
              </CardFooter>
            </Card>
          )}
        </>
      );
    },
  ),
);

export default Post;
