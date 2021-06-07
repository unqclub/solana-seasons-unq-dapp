import { web3 } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';

import { WalletAdapter } from '../contexts/wallet';
import { UNQ_SEED } from './club';
import { createTokenAccount, getProgram } from './program';

interface InitTradeData {
  clubAccountPublicKey: PublicKey;
  nftAddress: string;
  amount: number;
}

export async function initializeTrade(
  connection: Connection,
  wallet: WalletAdapter,
  data: InitTradeData
): Promise<string> {
  const { clubAccountPublicKey, nftAddress, amount } = data;
  const program = getProgram(connection, wallet);

  //example trade mint
  const tradeTokenMint = new PublicKey(
    "7uEus9dBa8p4SsKK22ryHkV9AVjvFtHuAUZA5F8b2jTR"
  );

  const tradeAmount = new BN(amount);

  const tradeAccount = Keypair.generate();

  const [tradeSigner] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(UNQ_SEED)],
    program.programId
  );

  const tradeTokenAccount = await createTokenAccount(
    program,
    wallet,
    tradeTokenMint,
    tradeSigner
  );

  await program.rpc.initializeTrade(nftAddress, tradeAmount, {
    accounts: {
      trade: tradeAccount.publicKey,
      club: clubAccountPublicKey,
      tradeSigner,
      tradeTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
    },
    signers: [tradeAccount],
    instructions: [await program.account.trade.createInstruction(tradeAccount)],
  });

  return tradeAccount.publicKey.toString();
}

interface TradeAccountData {
  nftAddress: string;
  amount: number;
}

export async function getTradeAccountData(
  tradeAccountAddress: string,
  connection: Connection
): Promise<TradeAccountData> {
  const program = getProgram(connection, {} as any);
  const tradeAccount: any = await program.account.trade.fetch(
    new PublicKey(tradeAccountAddress)
  );

  let nftAddress = tradeAccount.nftAddress.slice(0, 42);
  let amount = (tradeAccount.tradeAmount as BN).toNumber();
  nftAddress = String.fromCharCode(...nftAddress);

  return {
    nftAddress,
    amount,
  };
}
