import type { ButtonProps as ChakraButtonProps } from "@chakra-ui/react";
import { AbsoluteCenter, Button as ChakraButton, Span, Spinner } from "@chakra-ui/react";
import * as React from "react";
import "./button.css";

interface ButtonLoadingProps {
  loading?: boolean;
  loadingText?: React.ReactNode;
}

export interface ButtonProps extends ChakraButtonProps, ButtonLoadingProps {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const { loading, disabled, loadingText, children, ...rest } = props;
  return (
    <ChakraButton disabled={loading || disabled} ref={ref} {...rest}>
      {loading && !loadingText ? (
        <>
          <AbsoluteCenter display="inline-flex">
            <Spinner size="inherit" color="inherit" />
          </AbsoluteCenter>
          <Span opacity={0}>{children}</Span>
        </>
      ) : loading && loadingText ? (
        <>
          <Spinner size="inherit" color="inherit" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </ChakraButton>
  );
});

export function AddButton({ text, style = {}, onClick }) {
  return (
    <button type="button" className="button button-add" style={style} onClick={onClick}>
      {text}
    </button>
  );
}

export function ResetButton({ text, style = {}, onClick }) {
  return (
    <button type="button" className="button button-reset" style={style} onClick={onClick}>
      {text}
    </button>
  );
}
