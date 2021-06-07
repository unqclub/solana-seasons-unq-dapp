import { CheckCircleTwoTone } from '@ant-design/icons';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { Input, Space, Spin } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useEffect, useState } from 'react';

import { initializeTrade } from '../../../../actions';
import { RaisedButton } from '../../../../components/RaisedButton';
import { useConnection } from '../../../../contexts/connection';
import { useWallet } from '../../../../contexts/wallet';
import { Club } from '../../../../data/clubs';
import { saveTrade } from '../../../../data/trades';

export const BuyNftModal: React.FC<{
  visible: boolean;
  onCancel: () => any;
  club: Club;
}> = (props) => {
  const { visible, onCancel, club } = props;

  const [closable, setClosable] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [tradeUrl, setTradeUrl] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [ethBalance, setETHBalance] = useState(0);

  const [nftAddress, setNFTAddress] = useState("");
  const [amount, setAmount] = useState(0);

  const connection = useConnection();
  const { wallet } = useWallet();

  useEffect(() => {
    async function getETHBalance(): Promise<number> {
      const { value } = await connection.getParsedTokenAccountsByOwner(
        new PublicKey(club.accountAddress),
        {
          // mint: new PublicKey("CpMah17kQEL2wqyMKt3mZBdTnZbkbfx4nqmQMFDP5vwp"), // TODO
          programId: TOKEN_PROGRAM_ID,
        }
      );

      console.log(value);

      if (value.length === 0) {
        return 0;
      }

      // TODO
      return Number(value[0].account.data.parsed.info.tokenAmount.amount);
    }

    async function initialize() {
      try {
        setLoading(true);
        const balance = await getETHBalance();
        setETHBalance(balance);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [connection, visible, club.accountAddress]);

  async function submit() {
    setLoading(true);
    setClosable(false);

    const tradeAccountAddress = await initializeTrade(connection, wallet!, {
      clubAccountPublicKey: new PublicKey(club.accountAddress),
      nftAddress,
      amount,
    });
    await saveTrade({
      nftAddress,
      accountAddress: tradeAccountAddress,
      clubAccountAddress: club.accountAddress,
    });
    setTradeUrl(`${window.location.origin}/#/trade/${tradeAccountAddress}`);

    setLoading(false);
    setClosable(true);
  }

  function reset() {
    setTradeUrl("");
    setLinkCopied(false);
  }

  return (
    <Modal
      visible={visible}
      centered
      width={"60vw"}
      onCancel={() => {
        if (!closable) {
          return;
        }
        reset();
        onCancel();
      }}
      footer={null}
      closable={closable}
      maskClosable={closable}
      destroyOnClose={true}
    >
      <h1>Buy NFT</h1>

      {tradeUrl ? (
        <Space
          direction="vertical"
          size="large"
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2 style={{ marginBottom: 0 }}>Trade URL:</h2>
          <code>
            {tradeUrl}{" "}
            {linkCopied && <CheckCircleTwoTone twoToneColor="#52c41a" />}
          </code>
          <RaisedButton
            onClick={() =>
              navigator.clipboard
                .writeText(tradeUrl)
                .then(() => setLinkCopied(true))
            }
          >
            Copy link
          </RaisedButton>
        </Space>
      ) : (
        <Spin spinning={isLoading} size="large">
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <h3>
              Club ETH balance: <b>{ethBalance} ETH</b>
            </h3>
            <Input
              size="large"
              required
              placeholder="NFT address*"
              className="input"
              onChange={(e) => setNFTAddress(e.target.value)}
            />
            <Input
              size="large"
              required
              placeholder="ETH*"
              className="input"
              type="number"
              onChange={(e) => setAmount(Number(e.target.value))}
              min={0}
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <RaisedButton onClick={submit}>Buy</RaisedButton>
            </div>
          </Space>
        </Spin>
      )}
    </Modal>
  );
};
