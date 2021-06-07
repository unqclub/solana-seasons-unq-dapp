import './style.less';

import { Col, List, Row, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

import { getClubsNFTs } from '../../../actions';
import { OutlineButton } from '../../../components/OutlineButton';
import { useConnection } from '../../../contexts/connection';
import { useWallet } from '../../../contexts/wallet';
import { Club, getClub } from '../../../data/clubs';
import { BuyNftModal } from './components/BuyNFTModal';

export const ClubDetailsView: React.FC<{ id: string }> = ({ id }) => {
  const [isBuyNftModalVisible, setBuyNftModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [club, setClub] = useState<Club | null>(null);
  const [nftAddresses, setNFTAddresses] = useState<string[]>([]);

  const { wallet } = useWallet();
  const connection = useConnection();

  useEffect(() => {
    async function fetchNFTs() {
      const nftAddresses = await getClubsNFTs(connection, id);
      setNFTAddresses(nftAddresses);
    }

    async function fetchClub() {
      try {
        setLoading(true);
        const club = await getClub(id);
        setClub(club);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchClub();
    fetchNFTs();
  }, [connection, id, wallet]);

  return (
    <div className="club-details">
      {isLoading ? (
        <div className="spinner-wrapper">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[32, 48]} style={{ paddingTop: 16 }}>
            <Col span={12}>
              <img
                src={club?.imageUrl}
                className="club-image"
                alt={club?.name}
                style={{ maxHeight: "70vh", width: "100%", objectFit: "cover" }}
              />
            </Col>
            <Col span={12} className="club-info">
              <Space direction="vertical" size="large">
                <h1 className="club-name">{club?.name}</h1>
                {wallet?.publicKey?.toString() === club?.curatorAddress && (
                  <>
                    <OutlineButton onClick={() => setBuyNftModalVisible(true)}>
                      Buy NFT
                    </OutlineButton>
                    <BuyNftModal
                      visible={isBuyNftModalVisible}
                      onCancel={() => setBuyNftModalVisible(false)}
                      club={club!}
                    />
                  </>
                )}
                {/* <div className="tags">
                  {Array(4)
                    .fill(1)
                    .map((_, i) => (
                      <Tag key={i}>asdasd {i}</Tag>
                    ))}
                </div> */}
                <div>
                  <code className="club-address">
                    <b>Club address: </b>
                    {club?.accountAddress}
                  </code>
                </div>
                <div>
                  <code className="curator-address">
                    <b>Curator address: </b>
                    {club?.curatorAddress}
                  </code>
                </div>
                <p className="description">{club?.description}</p>
                <div className="club-stats">
                  <h5>Members</h5>
                  <h4>15.693</h4>
                </div>
                <div className="club-stats">
                  <h5>Valuation</h5>
                  <h4>$5.456.456,18</h4>
                </div>
              </Space>
            </Col>
          </Row>

          <List
            size="large"
            header={<div>NFTs</div>}
            footer={null}
            bordered
            dataSource={nftAddresses}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
        </>
      )}
    </div>
  );
};
