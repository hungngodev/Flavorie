import {
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  AspectRatio,
  GridProps,
  ImageProps,
  Image,
} from '@chakra-ui/react';
import { MediaObjectType } from './MockPosts';
import { memo } from 'react';

interface MediaGridProps extends GridProps {
  mediaData: MediaObjectType[];
  isLoaded: boolean;
  imageProps?: ImageProps;
}

const MediaGrid = memo<MediaGridProps>(({ mediaData, isLoaded = true, imageProps, ...props }) => {
  return (
    <Grid
      templateColumns={'3fr 1fr'}
      gridTemplateRows={mediaData.length <= 2 ? `1fr` : `${Math.min(mediaData.length, 3)}fr`}
      {...props}
    >
      {mediaData.map((media, index) => (
        <GridItem key={media.url} gridRow={index <= 1 ? 1 / -1 : '1fr'}>
          <Skeleton isLoaded={isLoaded}>
            {media.type === 'image' ? (
              <Image src={media.url} alt={media.description ?? `post-image - ${index}`} aspectRatio={1 / 1} />
            ) : (
              <video>
                <source src={media.url} type="video" />
              </video>
            )}
          </Skeleton>
        </GridItem>
      ))}
    </Grid>
  );
});
export default MediaGrid;
