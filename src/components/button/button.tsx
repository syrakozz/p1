import React, { Ref, forwardRef } from 'react';
import { Spinner, Button as TGButton, ButtonProps as TGButtonProps, TamaguiElement } from 'tamagui';

export type ButtonProps = TGButtonProps & {
  loading?: boolean;
};

function Button(props: ButtonProps, ref: Ref<TamaguiElement>): JSX.Element {
  const { disabled = false, loading = false, icon, ...rest } = props;
  const isDisabled = disabled || loading;

  return <TGButton ref={ref} disabled={isDisabled} opacity={isDisabled ? 0.5 : undefined} icon={loading ? <Spinner /> : icon} {...rest} />;
}

export default forwardRef(Button);
