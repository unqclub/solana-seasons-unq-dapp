import './style.less';

import { Col, Image, Row } from 'antd';
import React from 'react';

import { Club } from '../../data/clubs';

export const ClubItem: React.FC<{ club: Club }> = ({ club }) => {
  return (
    <div className="club-item">
      <div className="header">
        <Image
          // TODO: remove this
          src="http://placekitten.com/80/80"
          className="club-avatar"
          alt={club.name}
          height={40}
          width={40}
        />
        <h2 className="club-name">{club.name}</h2>
      </div>
      <img
        src=""
        className="club-image"
        style={{ "--background": `url(${club.imageUrl})` } as any}
        alt={club.name}
      />
      <Row className="club-stats">
        <Col span={8}>
          <h5>Members</h5>
          <h4>15.6k</h4>
        </Col>
        <Col span={8}>
          <h5>Valuation</h5>
          <h4>$5.4M</h4>
        </Col>
        {/* <Col
          span={8}
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <OutlineButton>Join</OutlineButton>
        </Col> */}
      </Row>
    </div>
  );
};
