import './style.less';

import { PlusCircleOutlined } from '@ant-design/icons';
import { Col, Input, Row, Space, Spin } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Modal from 'antd/lib/modal/Modal';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router';

import { createClub as createClubAction, getClubNeededBalance } from '../../../actions';
import { RaisedButton } from '../../../components/RaisedButton';
import { useConnection } from '../../../contexts/connection';
import { useWallet } from '../../../contexts/wallet';
import { saveClub, uploadClubImage } from '../../../data/clubs';

export const CreateClubView: React.FC = () => {
  const [clubName, setClubName] = useState("");
  const [clubImage, setClubImage] = useState<File | null>(null);
  const [clubDescription, setClubDescription] = useState("");
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isGettingCostEstimate, setGettingCostEstimate] = useState(false);
  const [neededBalance, setNeededBalance] = useState<number | null>(null);

  const connection = useConnection();
  const { wallet } = useWallet();
  const history = useHistory();

  async function createClub() {
    try {
      setLoading(true);
      console.log({ clubName, clubDescription, clubImage });

      const imageUrl = await uploadClubImage(clubImage);

      const response = await createClubAction(connection, wallet!);
      await saveClub({
        name: clubName,
        description: clubDescription,
        imageUrl,
        accountAddress: response.clubAccountAddress.toString(),
        tokenMintAccountAddress: response.clubTokenMintAccountAddress.toString(),
        curatorAddress: wallet!.publicKey!.toString(),
        createdAt: new Date().toISOString(),
      });

      console.log(response);

      history.push("/clubs");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <div className="create-club-view">
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%", alignItems: "center" }}
      >
        <h1>Create a club</h1>
        <Row className="form" gutter={32}>
          <Col span={12}>
            <ClubImage onFileChanged={(file) => setClubImage(file)} />
          </Col>
          <Col span={12}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Input
                size="large"
                required
                placeholder="Club name*"
                className="input"
                onChange={(e) => setClubName(e.target.value)}
              />
              <TextArea
                placeholder="Club description*"
                className="textarea"
                onChange={(e) => setClubDescription(e.target.value)}
                rows={4}
              />
              <div style={{ textAlign: "left" }}>
                <code>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Neque, ut assumenda fugit asperiores officiis, doloremque
                  necessitatibus pariatur eaque blanditiis obcaecati tempore
                  accusamus ea nesciunt odit ipsa esse dolorem. Harum, delectus!
                </code>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <RaisedButton
                  onClick={async () => {
                    setGettingCostEstimate(true);

                    const neededBalance = await getClubNeededBalance(
                      connection
                    );
                    setNeededBalance(
                      neededBalance.minClubAccountBalance +
                        neededBalance.minClubTokenMintAccountBalance
                    );

                    setGettingCostEstimate(false);
                    setConfirmModalVisible(true);
                  }}
                  disabled={!clubName || !clubDescription}
                  isLoading={isGettingCostEstimate}
                >
                  Create
                </RaisedButton>
              </div>
            </Space>
          </Col>
        </Row>
      </Space>
      <ConfirmModal
        visible={confirmModalVisible}
        neededBalance={neededBalance}
        onConfirm={(confirmed) => {
          setConfirmModalVisible(false);
          if (confirmed) {
            createClub();
          }
        }}
      />
      <Modal
        visible={isLoading}
        footer={null}
        centered
        closable={false}
        bodyStyle={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <h1>Creating a club...</h1>
        <Spin size="large" />
        <h2>Please don't close the app</h2>
      </Modal>
    </div>
  );
};

const ConfirmModal: React.FC<{
  visible: boolean;
  onConfirm: (confirmed: boolean) => any;
  neededBalance: number | null;
}> = (props) => {
  return (
    <Modal
      centered
      visible={props.visible}
      onOk={() => props.onConfirm(true)}
      onCancel={() => props.onConfirm(false)}
      footer={null}
      width={"60vw"}
    >
      <div style={{ padding: 20 }}>
        <h1>By creating a club you agree to the following</h1>
        <ul>
          {props.neededBalance !== null && (
            <li>
              Needed balance for creating a club:{" "}
              {props.neededBalance * 0.000000001} SOL
            </li>
          )}
        </ul>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <RaisedButton key={1} onClick={() => props.onConfirm(true)}>
            Confirm
          </RaisedButton>
        </div>
      </div>
    </Modal>
  );
};

const ClubImage: React.FC<{ onFileChanged: (file: File) => any }> = (props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string>("");

  return (
    <div className="club-image">
      <input
        ref={inputRef}
        onChange={(e) => {
          const files = e.target.files;
          if (!files) {
            return;
          }
          const file = files.item(0);
          if (!file) {
            return;
          }
          props.onFileChanged(file);
          const objectUrl = URL.createObjectURL(file);
          setImageSrc(objectUrl);
        }}
        type="file"
        style={{ display: "none" }}
      />
      {imageSrc ? (
        <img
          src={imageSrc}
          onClick={() => inputRef.current?.click()}
          alt="Club"
        />
      ) : (
        <div onClick={() => inputRef.current?.click()} className="placeholder">
          <div>
            <PlusCircleOutlined style={{ fontSize: 60 }} />
            <h3>Club image</h3>
          </div>
        </div>
      )}
    </div>
  );
};
