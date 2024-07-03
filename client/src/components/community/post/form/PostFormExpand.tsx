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
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import Webcam from 'react-webcam';
import { useAuth } from '../../../../hooks/index';
import CustomTextInput from '../../../form/CustomTextInput';
import CustomTextareaInput from '../../../form/CustomTextareaInput';
import ImageSlider from '../ImageSlider';
import { BasePostProps, MediaObjectType, PostEditObjectType, PostRequest, PostRequestType, parsePost } from '../types';

import { useDispatch, useSelector } from 'react-redux';
import { createRequest } from '../../../../slices/posts/CreatePost';
import { addPosts, updatePost } from '../../../../slices/posts/PostState';
import { selectUpdateStatus, updateRequest } from '../../../../slices/posts/UpdatePost';
import { AppDispatch } from '../../../../store/store';

interface PostFormExpandProps extends BasePostProps {
    isOpen: boolean;
    onClose: () => void;
    preload?: PostEditObjectType | null;
    action: 'update' | 'create';
    setLoading?: (arg?: any) => void;
}

const PostFormExpand: React.FC<PostFormExpandProps> = ({
    isOpen,
    onClose,
    action,
    preload,
    postIndex,
    postId,
    setLoading,
}) => {
    const theme = useTheme();

    const webCamRef = useRef<Webcam>(null);
    const [useWebcam, setUseWebcam] = useState<boolean>(false);

    const [previewMedia, setPreviewMedia] = useState<MediaObjectType[]>(
        preload && preload.savedPreviewMedia ? preload.savedPreviewMedia : [],
    );

    const { currentUser } = useAuth();
    const updateStatus = useSelector(selectUpdateStatus);

    const dispatch = useDispatch<AppDispatch>();

    const submitPost: SubmitHandler<PostRequestType> = async (data) => {
        try {
            switch (action) {
                case 'create':
                    await dispatch(createRequest(data))
                        .then((res: any) => dispatch(addPosts({ post: parsePost([res.payload.post]) })))
                        .then(() => onClose());
                    break;
                case 'update':
                    if (postId) {
                        const newFormData = new FormData();
                        newFormData.append('header', data.header);
                        newFormData.append('body', data.body);
                        newFormData.append('privacy', data.privacy);
                        newFormData.append('location', data.location);

                        data.media.forEach((mediaObj: any) => {
                            newFormData.append('media', mediaObj.file);
                        });

                        previewMedia.forEach((mediaObj) => {
                            if (!mediaObj.url.startsWith('blob')) {
                                newFormData.append('remainingMedia', JSON.stringify(mediaObj));
                            }
                        });

                        console.log(newFormData);

                        await dispatch(updateRequest({ postId, newFormData }))
                            .then((res: any) =>
                                dispatch(updatePost({ post: parsePost([res.payload.post]), postIndex: postIndex })),
                            )
                            .then(() => onClose());
                    }
                    break;
            }
        } catch (error) {
            console.error('Error posting data:', error);
        }
    };
    useEffect(() => {
        if (updateStatus === 'loading' && setLoading) {
            console.log('Loading...');
            setLoading(() => true);
        }
    }, [updateStatus, dispatch]);

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        watch,
    } = useForm<PostRequestType>({
        resolver: zodResolver(PostRequest),
        defaultValues: preload
            ? {
                  header: preload.header,
                  body: preload.body,
                  media: [],
                  privacy: preload.privacy ?? 'public',
                  location: preload.location ?? '',
              }
            : {
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

                        <ImageSlider
                            action="display"
                            slides={previewMedia}
                            onClose={handleFileRemove}
                            marginBlock={2}
                        />

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
                                    <Picker
                                        theme="light"
                                        previewPosition="none"
                                        data={data}
                                        onEmojiSelect={handleEmojiSelect}
                                    />
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
