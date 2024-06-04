import { Image, Menu, MenuButton, MenuItem, MenuItemProps, MenuList, MenuProps, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import z, { ZodType } from 'zod';

interface CustomMenuProps<T extends ZodType<any, any, any>> extends Omit<MenuProps, 'children'> {
  field?: z.infer<T>;
  items: string[];
  itemProps?: MenuItemProps;
  fieldProps: ControllerRenderProps<z.infer<T>, any>;
  title: string;
  display: React.ReactNode | JSX.Element;
}

function CustomMenu<T extends ZodType<any, any, any>>({
  field,
  items,
  itemProps,
  fieldProps,
  title,
  display,
  ...props
}: CustomMenuProps<T>) {
  return (
    <Menu {...props}>
      <VStack alignItems="flex-start">
        <Text color="blackAlpha.600" fontWeight="semibold">
          {title ?? 'Menu'}
        </Text>
        <MenuButton
          disabled={items.length > 0 ? false : true}
          type="button"
          arial-label="options"
          color="blackAlpha.600"
          fontWeight="semibold"
          fontSize="lg"
        >
          {display}{' '}
        </MenuButton>
        <MenuList>
          {items.map((item, index) => (
            <MenuItem {...itemProps} key={index} onClick={() => fieldProps.onChange(item)}>
              <Image
                borderRadius="lg"
                boxSize="5rem"
                src="https://img.freepik.com/free-vector/hand-drawn-flat-design-turkish-food-illustration_23-2149276733.jpg?w=826&t=st=1716431567~exp=1716432167~hmac=6eca3d748ea3362697544328f767549b297318ada51b416c2f8eabe4ed0b155f"
              />
              <Text color="blackAlpha.800" fontWeight="semibold" marginInline={2} fontSize="lg">
                {item}
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </VStack>
    </Menu>
  );
}

export default CustomMenu;
