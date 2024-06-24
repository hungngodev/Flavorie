import {
  Avatar,
  Box,
  Button,
  HStack,
  IconButton,
  Input,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  useTheme,
} from '@chakra-ui/react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Ellipsis, Images, SmilePlus, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import Webcam from 'react-webcam';
import { z } from 'zod';
import { useAuth } from '../../../../hooks/index';
import customFetch from '../../../../utils/customFetch';
import CustomTextInput from '../../../form/CustomTextInput';
import CustomTextareaInput from '../../../form/CustomTextareaInput';
import ImageSlider from '../ImageSlider';
import { MediaObjectType, parsePost } from '../types';
import { PostFormCardProps } from './PostFormCard';

interface PostFormExpandProps extends PostFormCardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostRequest = z.object({
  header: z.string().min(10, 'Title must be at least 10 characters').max(100, 'Title must not exceed 100 characters'),
  body: z.string().min(1, 'Body is required'),
  media: z.array(z.object({ file: z.instanceof(File) })),
  privacy: z.enum(['public', 'private', 'friend']),
  location: z.string(),
});

type PostRequestType = z.infer<typeof PostRequest>;

const PostFormExpand: React.FC<PostFormExpandProps> = ({ isOpen, onClose, updateFeed }) => {
  const [previewMedia, setPreviewMedia] = useState<MediaObjectType[]>([]);

  const webCamRef = useRef<Webcam>(null);

  const [useWebcam, setUseWebcam] = useState<boolean>(false);
  const { currentUser } = useAuth();
  const theme = useTheme();

  const submitPost: SubmitHandler<PostRequestType> = async (data) => {
    const formData = new FormData();

    formData.append('header', data.header);
    formData.append('body', data.body);
    formData.append('privacy', data.privacy);
    formData.append('location', data.location);

    data.media.forEach((mediaObj) => {
      formData.append('media', mediaObj.file);
    });
    try {
      const response = await customFetch.post('/community/post', formData);
      const newPost = parsePost([response.data.post]);
      updateFeed(newPost);
      onClose();
    } catch (error) {
      console.error('Error posting data:', error);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<PostRequestType>({
    resolver: zodResolver(PostRequest),
    defaultValues: {
      header: '',
      body: '',
      media: [],
      privacy: 'public',
      location: currentUser.location ?? '',
    },
    shouldFocusError: true,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'media',
  });

  // add file to the useField and update the state for preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target || !e.target.files) {
      return;
    }
    const file = e.target.files[0];
    if (file) {
      setPreviewMedia((prev) => [
        ...prev,
        {
          type: file.type.includes('image') ? 'image' : 'video',
          url: URL.createObjectURL(file),
          file,
          metadata: [],
          description: '',
        },
      ]);
      append({ file: file });
      console.log(previewMedia);
    }
  };

  // I have no idea what this is but basically it makes the result of capturing the webcam image into a file
  const capture = useCallback(() => {
    if (webCamRef.current) {
      const imageSrc = webCamRef.current.getScreenshot();
      if (imageSrc) {
        const byteString = atob(imageSrc.split(',')[1]);
        const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const file = new File([blob], 'webcam-image.jpg', { type: mimeString });
        console.log(file);
        setPreviewMedia((prev) => [
          ...prev,
          {
            type: 'image',
            url: URL.createObjectURL(file),
            file,
            metadata: [],
            description: '',
          },
        ]);
        append({ file: file });
      }
    }
  }, [webCamRef, append]);

  const handleFileRemove = (index: number) => {
    setPreviewMedia((prevFiles) => prevFiles.filter((_, i) => i !== index));
    remove(index);
  };

  const handleEmojiSelect = (e: any) => {
    const cur_text = getValues('body');
    setValue('body', cur_text + e.native);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" motionPreset="slideInRight">
      <ModalOverlay />
      <ModalContent maxHeight="100%">
        <ModalHeader paddingBottom={2}>Your post</ModalHeader>
        <ModalCloseButton />
        <ModalBody overflow="auto">
          <form onSubmit={handleSubmit(submitPost)}>
            <InputGroup display="flex" flexDirection="column">
              <Controller
                name="header" // Replace "name" with the correct property name
                control={control}
                render={({ field: { ...fieldProps } }) => (
                  <HStack>
                    <Avatar name={currentUser.username} src={currentUser.avatar} />
                    <CustomTextInput
                      placeholder="Title"
                      fieldprops={fieldProps}
                      variant="ghost"
                      fontSize="xl"
                      fontWeight="semibold"
                      isInvalid={errors.header ? true : false}
                      errorText={errors.header?.message}
                    />
                  </HStack>
                )}
              />
              <Controller
                name="body"
                control={control}
                render={({ field: { ...fieldProps } }) => (
                  <CustomTextareaInput
                    paddingInline={0}
                    variant="ghost"
                    placeholder="What is going on?"
                    fieldProps={fieldProps}
                    isInvalid={errors.body ? true : false}
                    errorText={errors.body?.message}
                  />
                )}
              />
            </InputGroup>

            <ImageSlider slides={previewMedia} onClose={handleFileRemove} marginBlock={2} />

            {useWebcam && (
              <Box position="relative" marginBlock={4}>
                <IconButton
                  icon={<Camera />}
                  aria-label="Capture-picture"
                  onClick={capture}
                  position="absolute"
                  top={2}
                  right={2}
                />
                <Menu>
                  <MenuButton
                    position="absolute"
                    top={2}
                    left={2}
                    as={IconButton}
                    icon={<Ellipsis color="black" />}
                    size="md"
                    isRound={true}
                    color="white"
                    padding={2}
                  />
                  <MenuList>
                    <MenuItem>
                      <Button></Button>
                    </MenuItem>
                  </MenuList>
                </Menu>

                {useWebcam && <Webcam ref={webCamRef} audio={false} />}
              </Box>
            )}
            <HStack
              gap={4}
              width="100%"
              rounded="md"
              border="2px"
              borderColor="gray.200"
              display="flex"
              alignItems="center"
              padding={4}
              justifyContent="flex-start"
            >
              <Text marginRight="auto" fontWeight="semibold">
                Add to your post
              </Text>
              <InputGroup width="auto`" position="relative" cursor="pointer" display="inline">
                <IconButton
                  aria-label="Upload file"
                  icon={<Images />}
                  size="md"
                  isRound={true}
                  backgroundColor={theme.colors.palette_pink}
                  color="white"
                  padding={2}
                />
                <Input
                  type="file"
                  accept="image/*,video/*"
                  variant="ghost"
                  onChange={(e) => {
                    handleFileUpload(e);
                  }}
                  sx={{
                    '::file-selector-button': {
                      display: 'none',
                    },
                  }}
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  opacity={0}
                  cursor="pointer"
                />
              </InputGroup>
              <IconButton
                aria-label="Open webcam"
                icon={useWebcam ? <X /> : <Camera />}
                size="md"
                isRound={true}
                backgroundColor={theme.colors.palette_lavender}
                color="white"
                padding={2}
                onClick={() => setUseWebcam((prev) => !prev)}
              />
              <Popover>
                <PopoverTrigger>
                  <IconButton
                    aria-label="Select-emojis"
                    icon={<SmilePlus />}
                    size="md"
                    isRound={true}
                    padding={2}
                    backgroundColor={theme.colors.palette_blue}
                    color="white"
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <Picker theme="light" previewPosition="none" data={data} onEmojiSelect={handleEmojiSelect} />
                </PopoverContent>
              </Popover>
            </HStack>

            <Button
              marginBlock={2}
              width="100%"
              fontWeight="semibold"
              fontSize="lg"
              type="submit"
              color="white"
              backgroundColor={theme.colors.palette_purple}
              _hover={{ backgroundColor: theme.colors.palette_indigo }}
            >
              Post
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default PostFormExpand;
