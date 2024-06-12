import {
  Avatar,
  Box,
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
} from '@chakra-ui/react';
import { Bookmark, CircleAlert, Ellipsis, EyeOff, History } from 'lucide-react';
import { memo } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import parseDate from '../../../utils/parseDate';

interface PostHeaderProps extends StackProps {
  avatar: string | undefined;
  author: string;
  date: Date;
  privacy: 'public' | 'private' | 'friend';
  location?: string;
}

const PostHeader = memo<PostHeaderProps>(({ avatar, author, date, privacy, location, ...props }) => (
  <HStack width="100%" justifyContent="space-between" alignItems="center">
    <Box>
      <Avatar
        name={author}
        src={avatar ?? 'https://github.com/shadcn.png'}
        aria-label="user-image"
        icon={<FaUserCircle />}
      />
      <VStack>
        <Text>{author}</Text>
        <Text>{parseDate(date)}</Text>
      </VStack>
    </Box>
    <Menu>
      <MenuButton as={IconButton} icon={<Ellipsis />} aria-label="post-options" />
      <MenuList>
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
      </MenuList>
    </Menu>
  </HStack>
));
export default PostHeader;
