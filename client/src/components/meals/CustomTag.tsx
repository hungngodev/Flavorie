import { Tag, TagLabel, TagLeftIcon, TagProps } from '@chakra-ui/react';
import React from 'react';

interface CustomTagProps extends TagProps {
  type: any;
  props?: TagProps;
  children?: React.ReactNode;
  canClose?: boolean;
  isOpen?: boolean;
  icon?: React.ComponentType;
  onClick?: () => void;
}

const CustomTag: React.FC<CustomTagProps> = React.forwardRef<HTMLSpanElement, CustomTagProps>(
  (
    {
      canClose = false,
      onClick,
      fontSize = '12',
      children,
      icon,
      type,
      ...props
    },
    ref,
  ) => {
    return (
      <Tag
        {...props}
        ref={ref}
        boxShadow="md"
        borderRadius="full"
        fontWeight="bold"
        pl="2"
        pr="3"
        width="max-content"
        onClick={onClick}
      >
        {icon && <TagLeftIcon as={icon} backgroundColor="gray.50" borderRadius="full" boxSize="1.85rem" border="1px" borderWidth="0.3rem" borderColor="gray.50" />}
        <TagLabel py="2" width="fit-content" fontSize="md" whiteSpace='nowrap'>{type}</TagLabel>
      </Tag>
    );
  },
);

export default CustomTag;