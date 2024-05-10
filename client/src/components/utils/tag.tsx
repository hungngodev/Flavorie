import { Tag, TagCloseButton, TagLabel, TagLeftIcon, TagProps, TagRightIcon, TypographyProps } from '@chakra-ui/react';
import React from 'react';
import { MdNoMeals, MdOutlineBrunchDining } from 'react-icons/md';
interface CustomTagProps {
  label: string;
  props?: TagProps;
  leftElement?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  rightElement?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  closeIcon?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  children?: React.ReactNode;
  canClose?: boolean;
  isOpen?: boolean;
  fontSize?: TypographyProps['fontSize'];
  handleClose?: () => void;
  handleClick?: () => void;
  type: 'allergy' | 'diet';
}

const CustomTag: React.FC<CustomTagProps> = React.forwardRef<HTMLSpanElement, CustomTagProps>(
  (
    {
      label,
      leftElement,
      rightElement,
      closeIcon,
      canClose = false,
      isOpen = true,
      handleClose,
      handleClick,
      fontSize = 'md',
      children,
      type,
      ...props
    },
    ref,
  ) => {
    const colorScheme = {
      allergy: {
        background: 'red.300',
        text: 'gray.100',
        icon: MdNoMeals,
      },
      diet: {
        background: 'green.400',
        text: 'gray.100',
        icon: MdOutlineBrunchDining,
      },
    };

    // Determine the left icon
    const LeftIcon = leftElement || colorScheme[type]['icon'];

    return (
      <>
        {isOpen && (
          <Tag
            {...props}
            ref={ref}
            onClick={handleClick}
            fontSize={fontSize}
            boxShadow="md"
            p="2"
            rounded="md"
            fontWeight="bold"
            bgColor={colorScheme[type]['background']}
            color={colorScheme[type]['text']}
          >
            {children}
            {LeftIcon && <TagLeftIcon textAlign="left" as={LeftIcon} />}
            <TagLabel px="1rem">{label}</TagLabel>
            {rightElement && <TagRightIcon as={rightElement} />}
            {canClose && <TagCloseButton onClick={handleClose} as={closeIcon} />}
          </Tag>
        )}
      </>
    );
  },
);

export default CustomTag;
