import './style.less';

import { Spin } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { getTradeAccountData } from '../../actions';
import { useConnection } from '../../contexts/connection';

const UNQ_ETH_ACCOUNT_ADDRESS = "0xa4564bca56b4ba654ba56b4ab58a7cb2";

export const ConfirmTradeView: React.FC<{
  tradeAccountAddress: string;
}> = ({ tradeAccountAddress }) => {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nftAddress, setNFTAddress] = useState("");
  const [amount, setAmount] = useState(0);

  const connection = useConnection();

  const getTradeAccountInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTradeAccountData(tradeAccountAddress, connection);
      setNFTAddress(data.nftAddress);
      setAmount(data.amount);
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [connection, tradeAccountAddress]);

  useEffect(() => {
    getTradeAccountInfo();
  }, [getTradeAccountInfo]);

  if (error) {
    return (
      <div className="confirm-trade-view">
        <h1 style={{ color: "red" }}>{error}</h1>
      </div>
    );
  }

  return (
    <div className="confirm-trade-view" style={{ zoom: 2 }}>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <h1>Trade {tradeAccountAddress}</h1>
          <p>
            Please send <b>{nftAddress}</b> to <b>{UNQ_ETH_ACCOUNT_ADDRESS}</b>{" "}
            in order to receive <b>{amount} ETH</b>
          </p>
        </>
      )}
    </div>
  );
};
