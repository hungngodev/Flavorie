import {
  Avatar,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  StackProps,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Bookmark, CircleAlert, Ellipsis, EyeOff, History, Trash } from 'lucide-react';
import { memo, useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import useAuth from '../../../hooks/useAuth';
import PostFormExpand from './form/PostFormExpand';
// import parseDate from '../../../utils/parseDate';
import { RootState, AppDispatch } from '../../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateRequest } from '../../../slices/posts/EditPost';
import { deleteRequest } from '../../../slices/posts/DeletePost';
import { selectPostPreloadByIndex, selectPostsByIndex, deletePost } from '../../../slices/posts/PostState';
import { PostEditObjectType, BasePostProps } from './types';

interface PostHeaderProps extends BasePostProps, StackProps {
  avatar?: string;
  author: string;
  date?: Date;
  privacy: 'public' | 'private' | 'friend';
  location?: string;
  canUpdate: boolean;
  preloadPost?: PostEditObjectType;
}

const PostHeader = memo<PostHeaderProps>(
  ({ avatar, author, date, privacy, location, index, canUpdate, postId, preloadPost, ...props }) => {
    const dispatch = useDispatch<AppDispatch>();
    // const post = useSelector((state: RootState) => selectPostsByIndex(index)(state));

    // const post = useSelector<RootState, { id: string } | undefined>((state: RootState) =>
    //   selectPostsByIndex(index)(state),
    // );

    // const [preloadPost, setPreloadPost] = useState<PostEditObjectType>({
    //   header: post.header ?? '',
    //   body: post.body ?? '',
    //   privacy: post.privacy ?? 'public',
    //   location: post.location ?? '',
    //   media: [],
    //   savedPreviewMedia: post.media ?? [],
    // });
    const { isOpen, onOpen, onClose } = useDisclosure();

    // useEffect(() => {
    //   setPreloadPost({
    //     header: post.header ?? '',
    //     body: post.body ?? '',
    //     privacy: post.privacy ?? 'public',
    //     location: post.location ?? '',
    //     media: [],
    //     savedPreviewMedia: post.media ?? [],
    //   });
    //   console.log(`PostHeader: ${post} `);
    // }, [post]);

    return (
      <HStack width="100%" justifyContent="space-between" alignItems="center" {...props}>
        <PostFormExpand
          index={index}
          action="update"
          preload={preloadPost}
          isOpen={isOpen}
          onClose={onClose}
          postId={postId}
        />
        <HStack gap={4} alignItems="start">
          <Avatar
            name={author}
            src={avatar ?? 'https://github.com/shadcn.png'}
            aria-label="user-image"
            icon={<FaUserCircle />}
          />
          <VStack alignItems="start" height="auto" gap={0}>
            <Text fontWeight="semibold" fontSize="lg">
              {author}
            </Text>
          </VStack>
        </HStack>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<Ellipsis />}
            aria-label="post-options"
            variant="ghost"
            isRound={true}
            fontSize="2xl"
          />
          <MenuList zIndex="200">
            {canUpdate && (
              <MenuItem icon={<Bookmark />} command="⌘U" onClick={onOpen}>
                Update post
              </MenuItem>
            )}
            <MenuItem icon={<Bookmark />} command="⌘S">
              Save post
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<History />} command="⌘E">
              See edit history
            </MenuItem>
            <MenuItem icon={<EyeOff />} command="⌘H">
              Hide
            </MenuItem>
            <MenuItem icon={<CircleAlert />} command="⌘R">
              Report
            </MenuItem>
            {canUpdate && (
              <MenuItem
                icon={<Trash />}
                command="⌘D"
                onClick={() => {
                  const request = dispatch(deleteRequest(postId));
                  if (deleteRequest.fulfilled.match(request)) {
                    dispatch(deletePost({ postIndex: index }));
                  }
                }}
              >
                Delete
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </HStack>
    );
  },
);
export default PostHeader;
