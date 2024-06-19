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
import { forwardRef, memo } from 'react';
import ImageSlider from './ImageSlider';
import { PostObjectType } from './MockPosts';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';

interface PostProps extends StackProps {
  postData: PostObjectType;
  isDisplayed?: boolean;
  headerProps?: CardHeaderProps;
  bodyProps?: CardBodyProps;
  footerProps?: CardFooterProps;
}

const Post = memo(
  forwardRef<HTMLDivElement, PostProps>(
    ({ postData, isDisplayed, headerProps, bodyProps, footerProps, ...containerProps }, ref) => {
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
                <PostFooter reacts={postData.reacts} reviews={postData.reviews} shares={postData.shares} />
              </CardFooter>
            </Card>
          )}
        </>
      );
    },
  ),
);

export default Post;
