import { HStack, IconButton, StackProps, StatLabel, Text, Tooltip } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { MessageCircle, Share2 } from 'lucide-react';
import { memo, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa6';
import { z } from 'zod';
import { useAuth } from '../../../hooks/index';
import customFetch from '../../../utils/customFetch';
import { ReactObject, ReviewObject, BasePostProps } from './types';
import { RootState, AppDispatch } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsPostLikedByUser, selectReactsByPostId, reactPost } from '../../../slices/posts/PostState';
import { likeRequest } from '../../../slices/posts/LikePost';

interface PostFooterProps extends StackProps, BasePostProps {
  // right now reacts are just a list of ids, no clear schema for reviews and shares yet
  reacts: string[] | undefined;
  reviews: z.infer<typeof ReviewObject>[] | undefined;
  shares: string[] | undefined;
  canUpdate: boolean;
  isLiked: boolean | undefined;
}

const PostFooter = memo<PostFooterProps>(({ index, postId, reacts, reviews, shares, isLiked, ...props }) => {
  const dispatch = useDispatch<AppDispatch>();
  // const reacts = useSelector((state: RootState) => selectReactsByPostId(postId)(state));
  // const isLiked = useSelector((state: RootState) => selectIsPostLikedByUser(postId, id)(state));

  const likeControl = useAnimationControls();
  const likePost = async () => {
    try {
      const likepost = await dispatch(likeRequest(postId ?? ''));
      if (likeRequest.fulfilled.match(likepost)) {
        dispatch(reactPost({ postIndex: index, reacts: likepost.payload.reacts }));
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
