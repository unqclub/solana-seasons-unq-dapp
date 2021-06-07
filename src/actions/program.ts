import { Program, Provider, web3 } from '@project-serum/anchor';
import { MintLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';

import { WalletAdapter } from '../contexts/wallet';

const idl: any = {
  version: "0.0.0",
  name: "club_program",
  instructions: [
    {
      name: "createClub",
      accounts: [
        {
          name: "club",
          isMut: true,
          isSigner: false,
        },
        {
          name: "clubSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clubTokenMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "clubTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "clubVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "clubTreasury",
          isMut: true,
          isSigner: false,
        },
        {
          name: "curator",
          isMut: false,
          isSigner: true,
        },
        {
          name: "curatorClubTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "nonce",
          type: "u8",
        },
        {
          name: "seeds",
          type: "string",
        },
      ],
    },
    {
      name: "initializeTrade",
      accounts: [
        {
          name: "trade",
          isMut: true,
          isSigner: false,
        },
        {
          name: "club",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tradeSigner",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tradeTokenAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "nftAddress",
          type: "string",
        },
        {
          name: "tradeAmount",
          type: "u64",
        },
      ],
    },
    {
      name: "confirmTrade",
      accounts: [
        {
          name: "trade",
          isMut: true,
          isSigner: false,
        },
        {
          name: "clubVault",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "txId",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "ClubVault",
      type: {
        kind: "struct",
        fields: [
          {
            name: "head",
            type: "u64",
          },
          {
            name: "tail",
            type: "u64",
          },
          {
            name: "clubAccount",
            type: "publicKey",
          },
          {
            name: "nfts",
            type: {
              array: [
                {
                  defined: "NFTOwnership",
                },
                150,
              ],
            },
          },
        ],
      },
    },
    {
      name: "ClubAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "curator",
            type: "publicKey",
          },
          {
            name: "clubTokenMint",
            type: "publicKey",
          },
          {
            name: "clubTokenAccount",
            type: "publicKey",
          },
          {
            name: "clubTreasury",
            type: "publicKey",
          },
          {
            name: "clubVault",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "ClubTreasury",
      type: {
        kind: "struct",
        fields: [
          {
            name: "clubAccount",
            type: "publicKey",
          },
          {
            name: "treasuryMint",
            type: "publicKey",
          },
          {
            name: "treasuryAmount",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "Trade",
      type: {
        kind: "struct",
        fields: [
          {
            name: "nftAddress",
            type: {
              array: ["u8", 64],
            },
          },
          {
            name: "nftTokenId",
            type: "u8",
          },
          {
            name: "tradeAmount",
            type: "u64",
          },
          {
            name: "club",
            type: "publicKey",
          },
          {
            name: "chainTxId",
            type: {
              array: ["u8", 128],
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "NFTOwnership",
      type: {
        kind: "struct",
        fields: [
          {
            name: "nftAddress",
            type: {
              array: ["u8", 64],
            },
          },
          {
            name: "txId",
            type: {
              array: ["u8", 128],
            },
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 100,
      name: "InvalidTradeSigner",
      msg:
        "The given trade signer does not create a valid program derived address.",
    },
    {
      code: 101,
      name: "InvalidNonce",
      msg: "The given nonce is not valid",
    },
  ],
};

const programId = new web3.PublicKey(
  "3DP4wTEWe8b3jFExfUUs2UpPzaZcxToK9zXpXZyeaarp"
);

export function getProgram(connection: Connection, wallet: WalletAdapter) {
  if (!wallet || !wallet.publicKey) {
    console.warn("Creating program without wallet!");
  }
  return new Program(
    idl,
    programId,
    new Provider(
      connection,
      {
        publicKey: wallet.publicKey!,
        signTransaction: wallet.signTransaction,
        signAllTransactions: async (txs) => {
          const signed: web3.Transaction[] = [];
          for (const tx of txs) {
            signed.push(await wallet.signTransaction(tx));
          }
          return signed;
        },
      },
      {}
    )
  );
}

export async function createMint(
  program: Program,
  wallet: WalletAdapter,
  authority: PublicKey
) {
  const mint = web3.Keypair.generate();
  const instructions = await createMintInstructions(
    program,
    wallet,
    authority,
    mint.publicKey
  );

  const tx = new web3.Transaction();
  tx.add(...instructions);

  await program.provider.send(tx, [mint]);

  return mint.publicKey;
}

async function createMintInstructions(
  program: Program,
  wallet: WalletAdapter,
  authority: PublicKey,
  mint: PublicKey
) {
  return [
    web3.SystemProgram.createAccount({
      fromPubkey: wallet.publicKey!,
      newAccountPubkey: mint,
      space: MintLayout.span,
      lamports: await program.provider.connection.getMinimumBalanceForRentExemption(
        82
      ),
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitMintInstruction(TOKEN_PROGRAM_ID, mint, 6, authority, null),
  ];
}

export async function createTokenAccount(
  program: Program,
  wallet: WalletAdapter,
  mint: web3.PublicKey,
  owner: PublicKey
) {
  const vault = web3.Keypair.generate();
  const tx = new web3.Transaction();

  const instructions = await createTokenAccountInstructions(program, wallet, {
    newAccountPublicKey: vault.publicKey,
    mint,
    owner,
  });

  tx.add(...instructions);

  await program.provider.send(tx, [vault]);

  return vault.publicKey;
}

async function createTokenAccountInstructions(
  program: Program,
  wallet: WalletAdapter,
  data: {
    newAccountPublicKey: web3.PublicKey;
    mint: web3.PublicKey;
    owner: PublicKey;
  }
) {
  const lamports = await program.provider.connection.getMinimumBalanceForRentExemption(
    165
  );

  return [
    web3.SystemProgram.createAccount({
      fromPubkey: wallet.publicKey!,
      newAccountPubkey: data.newAccountPublicKey,
      space: 165,
      lamports,
      programId: TOKEN_PROGRAM_ID,
    }),
    Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      data.mint,
      data.newAccountPublicKey,
      data.owner
    ),
  ];
}
