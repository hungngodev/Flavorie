import { HStack, IconButton, StackProps, Text, Tooltip } from '@chakra-ui/react';
import { motion, useAnimationControls } from 'framer-motion';
import { MessageCircle, Share2 } from 'lucide-react';
import { memo, useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import useAuth from '../../../hooks/useAuth';
import { likeRequest } from '../../../slices/posts/LikePost';
import { selectPosts, updatePost } from '../../../slices/posts/PostState';
import { AppDispatch } from '../../../store/store';
import { parsePost } from '../post/types';
import { BasePostProps } from './types';
interface PostFooterProps extends StackProps, BasePostProps {
  // right now reacts are just a list of ids, no clear schema for reviews and shares yet
  // isLiked: boolean | undefined;
  setLoading?: (arg?: any) => void;
}

const PostFooter = memo<PostFooterProps>(({ postIndex, postData, postId, ...props }) => {
  const auth = useAuth();
  const { id } = auth.currentUser;

  const dispatch = useDispatch<AppDispatch>();
  const post = postData ?? useSelector(selectPosts)[postIndex];
  const reacts = useSelector(selectPosts)[postIndex].reacts;
  const [isLiked, setIsLiked] = useState(useSelector(selectPosts)[postIndex].reacts?.includes(id) ?? false);

  const likeControl = useAnimationControls();
  const likePost = async () => {
    likeControl.start({ scale: [1, 1.2, 1], transition: { duration: 0.2, ease: 'easeInOut' } });
    try {
      await dispatch(likeRequest(postId)).then((res: any) => {
        console.log(res.payload);
        dispatch(updatePost({ postIndex: postIndex, post: parsePost([res.payload.reacts]) }));
        setIsLiked(useSelector(selectPosts)[postIndex].reacts?.includes(id) ?? false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Update content of FooterButtons based on props
  const [footerButtons, setFooterButtons] = useState([
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
  ]);

  useEffect(() => {
    setIsLiked(post?.reacts?.includes(id) ?? false);
    setFooterButtons([
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
    ]);
  }, [dispatch, post, postData]);
  return (
    <HStack gap={4} width="100%" justifyContent="flex-start" alignItems="center" {...props}>
      {footerButtons.map((button, index) => (
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
