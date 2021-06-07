import { web3 } from '@project-serum/anchor';
import { MintLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import BufferLayout from 'buffer-layout';

import { WalletAdapter } from '../contexts/wallet';
import { publicKey, uint64 } from '../utils/layout';
import { createMint, createTokenAccount, getProgram } from './program';

const clubAccountLayout = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  publicKey("ownerPubkey"),
  publicKey("clubFeeMintPubkey"),
  uint64("feeAmount"),
]);

export const UNQ_SEED = "UNQClubSeed";

export async function createClub(
  connection: Connection,
  wallet: WalletAdapter
) {
  const program = getProgram(connection, wallet);
  const clubAccount = web3.Keypair.generate();
  const [clubSigner, nonce] = await web3.PublicKey.findProgramAddress(
    [Buffer.from(UNQ_SEED)],
    program.programId
  );

  const clubTokenMint = await createMint(program, wallet, clubSigner);
  const clubTokenAccount = await createTokenAccount(
    program,
    wallet,
    clubTokenMint,
    clubSigner
  );
  const clubVaultAccount = web3.Keypair.generate();
  const clubTreasuryAccount = web3.Keypair.generate();

  const curatorClubTokenAccount = await createTokenAccount(
    program,
    wallet,
    clubTokenMint,
    wallet.publicKey!
  );

  await program.rpc.createClub(nonce, UNQ_SEED, {
    accounts: {
      club: clubAccount.publicKey,
      clubSigner,
      clubTokenMint,
      clubTokenAccount,
      clubVault: clubVaultAccount.publicKey,
      clubTreasury: clubTreasuryAccount.publicKey,
      curator: wallet.publicKey!,
      curatorClubTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      rent: web3.SYSVAR_RENT_PUBKEY,
    },
    signers: [clubAccount, clubVaultAccount, clubTreasuryAccount],
    instructions: [
      await program.account.clubAccount.createInstruction(clubAccount),
      await program.account.clubVault.createInstruction(clubVaultAccount),
      await program.account.clubTreasury.createInstruction(clubTreasuryAccount),
    ],
  });

  return {
    clubAccountAddress: clubAccount.publicKey,
    clubTokenMintAccountAddress: clubTokenMint,
  };
}

export async function getClubNeededBalance(connection: Connection) {
  const minClubAccountBalance = await connection.getMinimumBalanceForRentExemption(
    clubAccountLayout.span
  );

  const minClubTokenMintAccountBalance = await connection.getMinimumBalanceForRentExemption(
    MintLayout.span
  );

  return { minClubAccountBalance, minClubTokenMintAccountBalance }; // TODO Add platform fee
}

export async function getClubsNFTs(
  connection: Connection,
  clubAccountAddress: string
) {
  const program = getProgram(connection, {} as any);
  const clubAccountData: any = await program.account.clubAccount.fetch(
    new PublicKey(clubAccountAddress)
  );
  const clubVaultPublicKey = clubAccountData.clubVault;

  const vaultAccount: any = await program.account.clubVault.fetch(
    clubVaultPublicKey
  );

  const head = vaultAccount.head.toNumber();
  const tail = vaultAccount.tail.toNumber();
  const nfts: {
    nftAddress: number[];
    txId: number[];
  }[] = (vaultAccount.nfts as any[]).slice(tail, head); // TODO: tail and head are permuted

  const nftAddresses = nfts.map((el) => String.fromCharCode(...el.nftAddress));

  return nftAddresses;
}
