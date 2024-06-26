import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  HStack,
  StackProps,
  useDisclosure,
  useTheme,
} from '@chakra-ui/react';
import { Camera, Images, SmilePlus } from 'lucide-react';
import { memo, useState } from 'react';
import { useAuth } from '../../../../hooks/index';
import { PostObjectType } from '../types';
import PostFormExpand from './PostFormExpand';

export interface PostFormCardProps extends StackProps {}

const PostFormCard = memo<PostFormCardProps>(() => {
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const theme = useTheme();
  const Buttons = [
    {
      name: 'Images',
      icon: Images,
      color: theme.colors.palette_pink,
    },
    {
      name: 'Camera',
      icon: Camera,
      color: theme.colors.palette_lavender,
    },
    {
      name: 'Emojis',
      icon: SmilePlus,
      color: theme.colors.palette_blue,
    },
  ];
  const { currentUser } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpenModal = (buttonName: string) => () => {
    onOpen();
    setSelectedButton(buttonName);
  };
  return (
    <>
      {currentUser.status === 'authenticated' && (
        <Card marginBlock={4}>
          <CardBody display="flex">
            <HStack gap={4} width="100%" height="100%">
              <Avatar name={currentUser.username} src={currentUser.avatar} />
              <Button
                flex={1}
                onClick={onOpen}
                sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
                rounded="lg"
                padding={6}
                // backgroundColor="blackAlpha.50"
              >
                {`What are you thinking today ${currentUser.username}?`}
              </Button>
            </HStack>
            <PostFormExpand index={0} isOpen={isOpen} onClose={onClose} action="create" />
          </CardBody>
          <Divider color="blackAlpha.300" />
          <CardFooter paddingBlock={2}>
            <HStack gap={10} width="100%" justifyContent="flex-start">
              {Buttons.map((button, index) => (
                <Button
                  aria-label={button.name}
                  leftIcon={<button.icon color={button.color} />}
                  variant="ghost"
                  onClick={handleOpenModal(button.name)}
                >
                  {button.name}
                </Button>
              ))}
            </HStack>
          </CardFooter>
        </Card>
      )}
    </>
  );
});
export default PostFormCard;
