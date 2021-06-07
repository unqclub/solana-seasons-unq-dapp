import { ButtonProps } from 'antd/lib/button';
import React from 'react';

import { LABELS } from '../../constants';
import { useWallet } from '../../contexts/wallet';
import { RaisedButton } from '../RaisedButton';

export interface ConnectButtonProps
  extends ButtonProps,
    React.RefAttributes<HTMLElement> {
  allowWalletChange?: boolean;
}

export const ConnectButton = (props: ConnectButtonProps) => {
  const { connected, connect, provider } = useWallet();
  const { onClick, allowWalletChange } = props;

  if (!provider || !allowWalletChange) {
    return (
      <RaisedButton onClick={connected ? onClick : connect}>
        {LABELS.CONNECT_LABEL}
      </RaisedButton>
    );
  }

  return (
    <RaisedButton onClick={connected ? onClick : connect}>
      {LABELS.CONNECT_LABEL}
    </RaisedButton>
  );
};
