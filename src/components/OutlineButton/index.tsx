import './style.less';

import React from 'react';

export const OutlineButton: React.FC<{ onClick?: () => any }> = (props) => {
  return (
    <div onClick={props.onClick} className="outline-button">
      <button className="outline-button">{props.children}</button>
    </div>
  );
};
