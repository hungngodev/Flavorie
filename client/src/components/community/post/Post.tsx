import { Card, CardBody, CardFooter, CardHeader, Text, Heading, VStack, Image } from '@chakra-ui/react';
import React from 'react';
import { PostObjectType } from './MockPosts';
import PostFooter from './PostFooter';
import PostHeader from './PostHeader';
import ImageSlider from './ImageSlider';

interface PostProps {
  postData: PostObjectType;
  isDisplayed?: boolean;
}

const Post: React.FC<PostProps> = ({ postData, isDisplayed }) => {
  return (
    <>
      {isDisplayed && (
        <Card marginBlock={4}>
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
            <ImageSlider slides={postData.media} />
            {/* {postData.media.map((media, index) =>
                media.type === 'image' ? (
                  <Image
                    key={index}
                    src={media.url}
                    alt={media.description ?? `post-image-${index}`}
                    objectFit="cover"
                    className="slide-image"
                    height="100%"
                    marginInline="auto"
                  />
                ) : (
                  <video key={index} width="100%" height="100%" style={{ objectFit: 'cover' }}>
                    <source src={media.url} type="video/mp4" />
                  </video>
                ),
              )} */}
            {/* </ImageSlider> */}
          </CardBody>
          <CardFooter>
            <PostFooter reacts={postData.reacts} reviews={postData.reviews} shares={postData.shares} />
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default Post;
