import './style.less';

import { SettingOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import { LABELS } from '../../constants';
import { useWallet } from '../../contexts/wallet';
import { ConnectButton } from '../ConnectButton';
import { CurrentUserBadge } from '../CurrentUserBadge';
import { Settings } from '../Settings';

export const AppBar = () => {
  const { connected } = useWallet();

  const links = [
    { label: "About UNQ", link: "/" },
    { label: "Browse clubs", link: "/clubs" },
  ];
  if (connected) {
    links.push({ label: "Create club", link: "/clubs/create" });
  }

  return (
    <div className="App-Bar-right">
      {links.map((el) => (
        <Link key={el.label} to={el.link} className="app-bar-link">
          {el.label}
        </Link>
      ))}
      <a
        className="app-bar-link"
        href="https://docsend.com/view/keiyswe5wfhpvd4s"
        target="_blank"
        rel="noopener noreferrer"
      >
        Deck
      </a>
      {connected ? <CurrentUserBadge /> : <ConnectButton></ConnectButton>}
      <Popover
        placement="topRight"
        title={LABELS.SETTINGS_TOOLTIP}
        content={<Settings />}
        trigger="click"
      >
        <Button
          shape="circle"
          size="large"
          type="text"
          icon={<SettingOutlined />}
        />
      </Popover>
    </div>
  );
};
