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
import { editRequest } from '../../../slices/posts/EditPost';
import { deleteRequest } from '../../../slices/posts/DeletePost';
import { selectPostPreloadByIndex, selectPostsByIndex, deletePost } from '../../../slices/posts/PostState';

interface PostHeaderProps extends StackProps {
  avatar?: string;
  author: string;
  date?: Date;
  privacy: 'public' | 'private' | 'friend';
  location?: string;
  index: number;
}

const PostHeader = memo<PostHeaderProps>(({ avatar, author, date, privacy, location, index, ...props }) => {
  const dispatch = useDispatch<AppDispatch>();
  const preloadPost = useSelector((state: RootState) => selectPostPreloadByIndex(index)(state));
  const author_id = useSelector((state: RootState) => selectPostsByIndex(index)(state).author.id);
  const post = useSelector<RootState, { id: string } | undefined>((state: RootState) =>
    selectPostsByIndex(index)(state),
  );
  const postId = post?.id;
  const auth = useAuth();
  const { id } = auth.currentUser;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [validAuthor, setValidAuthor] = useState(id === author_id);

  useEffect(() => {
    setValidAuthor(id === author_id);
  }, [id, author_id]);

  return (
    <HStack width="100%" justifyContent="space-between" alignItems="center">
      <PostFormExpand index={index} action="edit" preload={preloadPost} isOpen={isOpen} onClose={onClose} />
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
          {validAuthor && (
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
          {validAuthor && (
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
});
export default PostHeader;
