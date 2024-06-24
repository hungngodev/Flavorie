import { HStack, IconButton, StackProps, StatLabel, Text, Tooltip } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { MessageCircle, Share2 } from 'lucide-react';
import { memo, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa6';
import { z } from 'zod';
import { useAuth } from '../../../hooks/index';
import customFetch from '../../../utils/customFetch';
import { ReactObject, ReviewObject } from './types';
import { RootState, AppDispatch } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsPostLikedByUser, selectReactsByPostId, reactPost } from '../../../slices/posts/PostState';
import { likeRequest } from '../../../slices/posts/LikePost';

interface PostFooterProps extends StackProps {
  // postid: string;
  // reacts?: z.infer<typeof ReactObject>[];
  // reviews?: z.infer<typeof ReviewObject>[];
  // shares?: string[];
  postid: string;
  index: number;
}

const PostFooter = memo<PostFooterProps>(({ index, postid, ...props }) => {
  const auth = useAuth();
  const { id } = auth.currentUser;
  const dispatch = useDispatch<AppDispatch>();
  const reacts = useSelector((state: RootState) => selectReactsByPostId(postid)(state));
  const isLiked = useSelector((state: RootState) => selectIsPostLikedByUser(postid, id)(state));

  const likeControl = useAnimationControls();
  const likePost = async () => {
    try {
      const likepost = await dispatch(likeRequest(postid));
      if (likeRequest.fulfilled.match(likepost)) {
        dispatch(reactPost({ postId: postid, reacts: likepost.payload.reacts }));
        likeControl.start({ scale: [1, 1.2, 1], transition: { duration: 0.2, ease: 'easeInOut' } });
      } else {
        console.error('Error posting data:', likepost);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
      content: [],
    },
    {
      name: 'Share',
      icon: Share2,
      content: [],
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
                  isLiked ? (
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
              color={button.name === 'React' ? (isLiked ? 'red.500' : 'blackAlpha.800') : 'blackAlpha.800'}
              onClick={button.name === 'React' ? () => likePost() : () => {}}
              _hover={{ backgroundColor: 'transparent' }}
              _active={{ backgroundColor: 'transparent' }}
              _focus={{ backgroundColor: 'transparent' }}
            />
          </Tooltip>
          <Text zIndex={2}>{button.content?.length ?? 0}</Text>
        </HStack>
      ))}
    </HStack>
  );
});

export default PostFooter;
