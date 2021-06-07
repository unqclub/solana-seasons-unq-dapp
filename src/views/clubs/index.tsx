import './style.less';

import { Col, Row, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ClubItem } from '../../components/ClubItem';
import { Club, getClubs } from '../../data/clubs';

export const ClubsView = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setLoading] = useState(false);

  const fetchClubs = () => {
    let isActive = true;

    setLoading(true);
    getClubs()
      .then((clubs) => isActive && setClubs(clubs))
      .catch(console.error)
      .finally(() => isActive && setLoading(false));

    return () => {
      isActive = false;
    };
  };

  useEffect(fetchClubs, []);

  return (
    <div className="clubs-view">
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        <h1>Clubs</h1>
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <Row gutter={[40, 60]}>
            {clubs.map((club) => (
              <Col key={club.accountAddress} span={6}>
                <Link to={`/clubs/${club.accountAddress}`}>
                  <ClubItem club={club} />
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </Space>
    </div>
  );
};
