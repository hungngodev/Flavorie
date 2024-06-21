import { useAuth } from '../../../../hooks/index';
import { useState, useEffect } from 'react';
import customFetch from '../../../../utils/customFetch';
import {
  Card,
  CardBody,
  CardHeader,
  HStack,
  VStack,
  Button,
  Textarea,
  Input,
  Text,
  Divider,
  CardFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  useDisclosure,
  Avatar,
  Box,
  useTheme,
} from '@chakra-ui/react';
import CustomTextInput from '../../../form/CustomTextInput';
import CustomTextareaInput from '../../../form/CustomTextareaInput';
import { SubmitHandler, useForm, Controller, useFieldArray } from 'react-hook-form';
import { PostObject, PostObjectType, MediaObject } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Buttons } from './PostFormCard';
import { Images, Video, Camera } from 'lucide-react';

interface PostFormExpandProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostRequest = z.object({
  header: z.string().min(10, 'Title must be at least 10 characters').max(100, 'Title must not exceed 100 characters'),
  body: z.string().min(1, 'Body is required'),
  media: z.array(MediaObject),
});

type PostRequestType = z.infer<typeof PostRequest>;

const PostFormExpand: React.FC<PostFormExpandProps> = ({ isOpen, onClose }) => {
  const [files, selectFiles] = useState<any[]>([]);
  const { currentUser } = useAuth();
  const theme = useTheme();

  const submitPost: SubmitHandler<PostRequestType> = async (data) => {
    // const postRequest = await customFetch.post('/community/post', data);
    // console.log(postRequest);
    console.log({
      data, // This will give you the correct media array
    });
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PostRequestType>({
    // resolver: zodResolver(PostRequest),
    defaultValues: {
      header: '',
      body: '',
      media: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'media',
  });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    if (!e.target || !e.target.files) {
      return;
    }
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      append({
        type: type,
        url: URL.createObjectURL(file),
        metadata: [],
        description: '',
      });
    }
    console.log(watch('media'));
  };
  useEffect(() => {
    console.log(fields);
  }, [watch('media')]);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader paddingBottom={2}>Your post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(submitPost)}>
            <InputGroup display="flex" flexDirection="column">
              <Controller
                name="header"
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
            <Button
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
        <ModalFooter paddingBlock={2}>
          <HStack gap={2} width="100%" justifyContent="flex-start">
            <Input
              type="file"
              accept="image/*"
              placeholder="Last name"
              onChange={(e) => {
                handleFileChange(e, 'image');
              }}
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default PostFormExpand;
