import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { Button, Col, Input, Row, Space, Spin } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useEffect, useState } from 'react';

import { RaisedButton } from '../../../../components/RaisedButton';
import { useConnection } from '../../../../contexts/connection';
import { useWallet } from '../../../../contexts/wallet';

interface Props {
  visible: boolean;
  onCancel: () => any;
}

export const JoinClubModal: React.FC<Props> = (props) => {
  const { visible, onCancel } = props;

  const [isLoading, setLoading] = useState(false);
  const [usdcBalance, setUSDCBalance] = useState<number>(0);

  const { wallet } = useWallet();
  const connection = useConnection();

  useEffect(() => {
    async function getUSDCBalance(): Promise<number> {
      const { value } = await connection.getTokenAccountsByOwner(
        wallet!.publicKey as PublicKey,
        {
          mint: new PublicKey("4RqCUhGFzGUt6Kn26zzUdfysMCs9b6hWpPo1gM3qpSZs"), // TODO
          programId: TOKEN_PROGRAM_ID,
        }
      );

      let sum = 0;
      for (const { account } of value) {
        sum += account.lamports;
      }

      return sum;
    }

    async function initialize() {
      try {
        console.log("Iniit");
        setLoading(true);
        const balance = await getUSDCBalance();
        setUSDCBalance(balance);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [connection, wallet, visible]);

  async function requestAirdrop() {
    await connection.requestAirdrop(
      wallet!.publicKey as PublicKey,
      2 * LAMPORTS_PER_SOL
    );
  }

  async function submit() {
    // TODO
  }

  return (
    <Modal
      visible={visible}
      centered
      width={"60vw"}
      footer={null}
      destroyOnClose={true}
      onCancel={onCancel}
    >
      <Spin spinning={isLoading}>
        <h1>Join this club</h1>

        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Row>
              <Col span={12}>
                <h3>Account</h3>
              </Col>
              <Col span={12}>
                <h3>Balance</h3>
              </Col>
            </Row>
            <Row>
              <Col span={12}>USDC</Col>
              <Col span={12}>
                {usdcBalance || (
                  <Button onClick={() => requestAirdrop()}>Airdrop</Button>
                )}{" "}
                // TODO: convert from lamports to USDC
              </Col>
            </Row>
          </div>

          <Input placeholder="Amount" type="number"></Input>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <RaisedButton onClick={submit}>JOIN</RaisedButton>
          </div>
        </Space>
      </Spin>
    </Modal>
  );
};
