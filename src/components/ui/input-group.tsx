import type { BoxProps, InputProps } from "@chakra-ui/react";
import { Box, Input } from "@chakra-ui/react";
import * as React from "react";

export interface InputGroupProps extends BoxProps {
  startElementProps?: BoxProps;
  endElementProps?: BoxProps;
  startElement?: React.ReactNode;
  endElement?: React.ReactNode;
  children: React.ReactElement<InputProps>;
  startOffset?: InputProps["paddingStart"];
  endOffset?: InputProps["paddingEnd"];
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(function InputGroup(
  props,
  ref
) {
  const {
    startElement,
    startElementProps,
    endElement,
    endElementProps,
    children,
    startOffset = "6px",
    endOffset = "6px",
    ...rest
  } = props;

  const child = React.Children.only<React.ReactElement<InputProps>>(children);

  return (
    <Box ref={ref} {...rest} display="flex" alignItems="center">
      {startElement && (
        <Box
          as="span"
          pointerEvents="none"
          {...startElementProps}
          mr={startElement ? startOffset : 0} // optional margin between the elements
        >
          {startElement}
        </Box>
      )}
      {React.cloneElement(child, {
        ...(startElement && { paddingStart: `calc(var(--input-height) - ${startOffset})` }),
        ...(endElement && { paddingEnd: `calc(var(--input-height) - ${endOffset})` }),
        ...child.props,
      })}
      {endElement && (
        <Box as="span" {...endElementProps} ml={endElement ? endOffset : 0}>
          {endElement}
        </Box>
      )}
    </Box>
  );
});
