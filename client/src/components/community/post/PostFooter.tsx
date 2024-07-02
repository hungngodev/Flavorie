import { HStack, IconButton, StackProps, Text, Tooltip } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { MessageCircle, Share2 } from 'lucide-react';
import { memo } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../../hooks/useAuth';
import { likeRequest } from '../../../slices/posts/LikePost';
import { reactPost, selectPosts } from '../../../slices/posts/PostState';
import { AppDispatch } from '../../../store/store';
import { BasePostProps } from './types';
interface PostFooterProps extends StackProps, BasePostProps {
  // right now reacts are just a list of ids, no clear schema for reviews and shares yet
  // isLiked: boolean | undefined;
  setLoading?: (arg?: any) => void;
}

const PostFooter = memo<PostFooterProps>(({ index, postId, postData, ...props }) => {
  const auth = useAuth();
  const { id } = auth.currentUser;

  const dispatch = useDispatch<AppDispatch>();
  const post = typeof index === 'number' ? useSelector(selectPosts)[index] : postData ? postData : null;
  const reacts = typeof index === 'number' ? useSelector(selectPosts)[index].reacts : postData?.reacts ?? [];
  const isLiked =
    typeof index === 'number'
      ? useSelector(selectPosts)[index].reacts?.includes(id)
      : postData
        ? postData.reacts?.includes(id)
        : false;

  const likeControl = useAnimationControls();
  const likePost = async () => {
    try {
      await dispatch(likeRequest(postId)).then((res: any) => {
        console.log(res);
        likeControl.start({ scale: [1, 1.2, 1], transition: { duration: 0.2, ease: 'easeInOut' } });
        dispatch(reactPost({ postIndex: index, reacts: res.payload.reacts }));
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Update content of FooterButtons based on props
  const FooterButtons = [
    {
      name: 'React',
      icon: FaRegHeart,
      content: post?.reacts ?? [],
    },
    {
      name: 'Review',
      icon: MessageCircle,
      content: post?.reviews ?? [],
    },
    {
      name: 'Share',
      icon: Share2,
      content: post?.shares ?? [],
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
