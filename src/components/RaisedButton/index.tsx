import './style.less';

import { Spin } from 'antd';
import React from 'react';

export const RaisedButton: React.FC<{
  onClick?: any;
  isLoading?: boolean;
  disabled?: boolean;
}> = ({ children, onClick, isLoading, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={isLoading ? null : onClick}
      className={`raised-button${isLoading ? " loading" : ""}${
        disabled ? " disabled" : ""
      }`}
    >
      {isLoading && <Spin size="large" className="spinner" />}
      {children}
    </button>
  );
};
