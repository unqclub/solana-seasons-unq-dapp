import { http } from './http-client';

export interface Trade {
  nftAddress: string;
  accountAddress: string;
  clubAccountAddress: string;
}

export async function saveTrade(trade: Trade) {
  const response = await http.post("trades", trade);

  return response.data;
}
