import {
  Grid,
  GridItem,
  Skeleton,
  GridProps,
  ImageProps,
  Image,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from '@chakra-ui/react';
import { MediaObjectType } from './MockPosts';
import { memo, useRef, useState } from 'react';

interface MediaGridProps extends GridProps {
  mediaData: MediaObjectType[];
  isLoaded: boolean;
  imageProps?: ImageProps;
}

const MediaGrid = memo<MediaGridProps>(({ mediaData, isLoaded = true, imageProps, ...props }) => {
  const [slide, setSlide] = useState<MediaObjectType[]>(mediaData.length <= 4 ? mediaData : mediaData.slice(0, 4));
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dynamic_rows = mediaData.length <= 2 ? 1 : slide.length - 1;
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Grid
      templateColumns={slide.length <= 2 ? `1fr` : '5fr 4fr'}
      gridAutoRows="1fr"
      gridAutoFlow="column"
      {...props}
      gap={1}
    >
      {slide.map((media, index) => (
        <GridItem
          key={media.url}
          gridRow={index === 0 ? `span ${dynamic_rows}` : `auto`}
          gridColumn={index === 0 ? 1 : 2}
          overflow="hidden"
          zIndex="100"
        >
          <Skeleton isLoaded={isLoaded} height="100%" width="100%" position="relative">
            {index === slide.length - 1 && mediaData.length > slide.length ? (
              <Text position="absolute" top="50%" right="50%" color="white" zIndex="100">
                +{mediaData.length - slide.length}
              </Text>
            ) : null}
            {index === slide.length - 1 && mediaData.length > slide.length ? (
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Modal Title</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <p>test</p>
                  </ModalBody>
                </ModalContent>
              </Modal>
            ) : null}
            {media.type === 'image' ? (
              <Image
                src={media.url}
                alt={media.description ?? `post-image - ${index}`}
                objectFit="cover"
                height="100%"
                width="100%"
                justifySelf="center"
                alignSelf="center"
                {...imageProps}
                onClick={
                  index === slide.length - 1 && mediaData.length > slide.length
                    ? () => {
                        onOpen();
                      }
                    : undefined
                }
                filter={index === slide.length - 1 && mediaData.length > slide.length ? 'brightness(20%)' : 'none'}
              />
            ) : (
              <video width="100%" height="100%" style={{ objectFit: 'cover' }}>
                <source src={media.url} type="video/mp4" />
              </video>
            )}
          </Skeleton>
        </GridItem>
      ))}
    </Grid>
  );
});

export default MediaGrid;
