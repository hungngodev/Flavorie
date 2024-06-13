import {
  Box,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Text,
  Heading,
  CardProps,
  HStack,
  Divider,
  VStack,
} from '@chakra-ui/react';
import React from 'react';
import { PostObjectType } from './MockPosts';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';
import MediaGrid from './MediaGrid';
interface PostProps extends CardProps {
  postData: PostObjectType;
  isDisplayed?: boolean;
}

const Post: React.FC<PostProps> = ({ postData, isDisplayed, ...props }) => {
  return (
    <>
      {isDisplayed && (
        <Card {...props} marginBlock={4}>
          <CardHeader paddingBottom={2}>
            <PostHeader
              avatar={postData.author.avatar}
              author={postData.author.name}
              date={postData.date}
              privacy={postData.privacy}
              location={postData.location}
            />
          </CardHeader>
          <CardBody paddingBlock={0}>
            <VStack gap={6} alignItems="start">
              <Heading size="lg">{postData.header}</Heading>
              <Text>{postData.body}</Text>
            </VStack>
          </CardBody>
          <MediaGrid mediaData={postData.media} isLoaded={true} marginBlock={2} height="50dvh" />
          <CardFooter>
            <PostFooter reacts={postData.reacts} reviews={postData.reviews} shares={postData.shares} />
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default Post;
