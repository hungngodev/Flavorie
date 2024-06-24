import { HStack, IconButton, StackProps, Text, Tooltip } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { MessageCircle, Share2 } from 'lucide-react';
import { memo, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa6';
import { z } from 'zod';
import { useAuth } from '../../../hooks/index';
import customFetch from '../../../utils/customFetch';
import { ReactObject, ReviewObject } from './types';

interface PostFooterProps extends StackProps {
  postid: string;
  reacts?: z.infer<typeof ReactObject>[];
  reviews?: z.infer<typeof ReviewObject>[];
  shares?: string[];
  isLiked?: boolean;
}

const PostFooter = memo<PostFooterProps>(({ reacts, reviews, shares, postid, ...props }) => {
  const auth = useAuth();
  // const [visible, setVisible] = useState(auth.currentUser.status === 'authenticated');
  const [like, setLike] = useState<boolean>(false);
  const likeControl = useAnimationControls();
  const likePost = async () => {
    try {
      const likeRequest = await customFetch.post(`/community/post/react/${postid}`);
      console.dir(likeRequest);
      if (likeRequest.status === 200) {
        setLike((like) => !like);
        likeControl.start({ scale: [1, 1.2, 1], transition: { duration: 0.2, ease: 'easeInOut' } });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   setVisible(auth.currentUser.status === 'authenticated');
  // }, [auth.currentUser.status]);

  // Update content of FooterButtons based on props
  const FooterButtons = [
    {
      name: 'React',
      icon: FaRegHeart,
      content: reacts ?? [],
    },
    {
      name: 'Review',
      icon: MessageCircle,
      content: reviews ?? [],
    },
    {
      name: 'Share',
      icon: Share2,
      content: shares ?? [],
    },
  ];
  return (
    <HStack gap={4} width="100%" justifyContent="flex-start" alignItems="center" {...props}>
      {FooterButtons.map((button, index) => (
        <HStack key={index} alignItems="center" gap={0} marginLeft={button.name === 'Share' ? 'auto' : 0}>
          <Tooltip label={button.name} gap={2}>
            <IconButton
              as={motion.button}
              aria-label={`${button.name}-button`}
              icon={
                button.name === 'React' ? (
                  like ? (
                    <FaHeart size="1.3em" />
                  ) : (
                    <FaRegHeart size="1.3em" />
                  )
                ) : (
                  <button.icon />
                )
              }
              variant="ghost"
              isRound={true}
              animate={button.name === 'React' ? likeControl : ''}
              color={button.name === 'React' ? (like ? 'red.500' : 'blackAlpha.800') : 'blackAlpha.800'}
              onClick={button.name === 'React' ? () => likePost() : () => {}}
              _hover={{ backgroundColor: 'transparent' }}
              _active={{ backgroundColor: 'transparent' }}
              _focus={{ backgroundColor: 'transparent' }}
            />
          </Tooltip>
          <Text zIndex={2}>{reacts?.length ?? 0}</Text>
        </HStack>
      ))}
    </HStack>
  );
});

export default PostFooter;
