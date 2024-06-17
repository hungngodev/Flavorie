import { Box, Image } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { z } from 'zod';
import { MockPosts, PostObjectType, PostObject } from '../components/community/post/MockPosts';
import { Post } from '../components/community/post/index';
import customFetch from '../utils/customFetch';
import { useQuery } from '@tanstack/react-query';
import { Player } from '@lottiefiles/react-lottie-player';

const style = {
  backgroundColor: 'gray.50',
};

const NewsFeedRequest = z.object({
  page: z.number().optional(),
  limits: z.number().optional(),
});
type NewsFeedRequestType = z.infer<typeof NewsFeedRequest>;

function newsfeedLoader(page: any, limits: number = 10) {
  return useQuery({
    queryKey: ['newsfeed', page],
    queryFn: async () => {
      const request: NewsFeedRequestType = { page: page, limits: limits };
      const test = await customFetch.get('/community/feed', { data: request });
      console.log(test);
      return test;
    },
  });
}

const Feed = () => {
  const [page, setPage] = useState(1);
  const [postData, setPostData] = useState<PostObjectType[]>([]);
  const { data, isLoading, isError, status } = newsfeedLoader(page);

  const parseData = (data: any) => {
    if (!data) return;
    const newFeed = data.map((post: any) => ({
      id: post._id,
      author: {
        id: post.author.id,
        name: post.author.name,
        location: post.author.location,
        avatar: post.author.avatar,
      },
      header: post.header,
      body: post.body,
      media: post.media.map((media: any) => ({
        type: media.type,
        url: media.url,
        metadata: media.metadata,
        description: media.description ?? 'Image of post',
      })),
      location: post.location,
      privacy: post.privacy,
      reviews: [],
      react: [],
      date: post.createdAt,
    }));
    setPostData((prev) => {
      if (prev.length === 0) return newFeed;
      return [...prev, ...newFeed];
    });
  };
  useEffect(() => {
    parseData(data?.data.posts);
  }, [data]);

  // useEffect(() => {
  //   const generateFeed = async () => {
  //     try {
  //       const request: NewsFeedREquestType = { page: page, limits: 10 };
  //       await customFetch.get('/community/feed', { data: request }).then((res) => {
  //         // console.log(res.data.data);

  //         const newfeed: PostObjectType[] = res.data.posts.map((post: any) => ({
  //           id: post._id,
  //           author: {
  //             id: post.author.id,
  //             name: post.author.name,
  //             location: post.author.location,
  //             avatar: post.author.avatar,
  //           },
  //           header: post.header,
  //           body: post.body,
  //           media: post.media.map((media: any) => ({
  //             type: media.type,
  //             url: media.url,
  //             metadata: media.metadata,
  //             description: media.description ?? 'Image of post',
  //           })),
  //           location: post.location,
  //           privacy: post.privacy,
  //           reviews: [],
  //           react: [],
  //           date: post.createdAt,
  //         }));
  //         setPostData((prev) => {
  //           if (prev.length === 0) return newfeed;
  //           return [...prev, ...newfeed];
  //         });
  //       });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   generateFeed();
  // }, []);

  return (
    <Box
      width="100%"
      height="100%"
      overflow="auto"
      backgroundColor="blackAlpha.50"
      paddingX={{ base: 0, lg: '10%', xl: '20%' }}
    >
      {/* {isLoading && <Player src="https://lottie.host/3b9443d5-6907-4450-9d15-05162dda8567/ROgx2wWIMC.json" />} */}
      {isError && (
        <Image
          src="https://i.pinimg.com/564x/1d/eb/55/1deb55f0a1b3f70fb5e791e1fa7953ea.jpg"
          alt="Error cat illustration"
          width={{ base: '100%', md: '80%', xl: '60%' }}
          aspectRatio={1 / 1}
        />
      )}
      {postData?.map((post) => <Post key={post.id} postData={post} isDisplayed />)}
    </Box>
  );
};
export default Feed;
