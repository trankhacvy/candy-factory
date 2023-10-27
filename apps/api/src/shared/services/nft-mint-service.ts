import { Injectable } from '@nestjs/common';
import { default as BN } from 'bn.js';
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createAccount,
  createMint,
  mintTo,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
  MetadataArgs,
  TreeConfig,
  computeCreatorHash,
  computeDataHash,
  createMintToCollectionV1Instruction,
  getLeafAssetId,
} from '@metaplex-foundation/mpl-bubblegum';
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
  deserializeChangeLogEventV1,
} from '@solana/spl-account-compression';
import {
  PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID,
  CreateMetadataAccountArgsV3,
  createCreateMetadataAccountV3Instruction,
  createCreateMasterEditionV3Instruction,
  createSetCollectionSizeInstruction,
} from '@metaplex-foundation/mpl-token-metadata';
import base58 from 'bs58';
import { ConnectionService } from './connection-service';
import { ShyftSdk } from '@shyft-to/js';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class MintNFTService {
  shyft: ShyftSdk;

  constructor(
    private connectionService: ConnectionService,
    private configService: ConfigService<AllConfigType>,
  ) {
    this.shyft = new ShyftSdk({
      apiKey: this.configService.getOrThrow('solana.shyftApikey', {
        infer: true,
      }),
      network: this.configService.getOrThrow('solana.cluster', {
        infer: true,
      }),
    });
  }

  async mintCollection(metadata: CreateMetadataAccountArgsV3) {
    // create and initialize the SPL token mint
    const connection = this.connectionService.getConnection();
    const payer = this.connectionService.feePayer;

    console.log("Creating the collection's mint...");
    const mint = await createMint(
      connection,
      payer,
      // mint authority
      payer.publicKey,
      // freeze authority
      payer.publicKey,
      // decimals - use `0` for NFTs since they are non-fungible
      0,
    );
    console.log('Mint address:', mint.toBase58());

    // create the token account
    console.log('Creating a token account...');
    const tokenAccount = await createAccount(
      connection,
      payer,
      mint,
      payer.publicKey,
      // undefined, undefined,
    );

    // mint 1 token ()
    console.log('Minting 1 token for the collection...');
    const mintSig = await mintTo(
      connection,
      payer,
      mint,
      tokenAccount,
      payer,
      // mint exactly 1 token
      1,
      // no `multiSigners`
      [],
      undefined,
      TOKEN_PROGRAM_ID,
    );
    // console.log(explorerURL({ txSignature: mintSig }));

    // derive the PDA for the metadata account
    const [metadataAccount, _bump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata', 'utf8'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    );
    console.log('Metadata account:', metadataAccount.toBase58());

    // create an instruction to create the metadata account
    const createMetadataIx = createCreateMetadataAccountV3Instruction(
      {
        metadata: metadataAccount,
        mint: mint,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        updateAuthority: payer.publicKey,
      },
      {
        createMetadataAccountArgsV3: metadata,
      },
    );

    // derive the PDA for the metadata account
    const [masterEditionAccount, _bump2] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata', 'utf8'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from('edition', 'utf8'),
      ],
      TOKEN_METADATA_PROGRAM_ID,
    );
    console.log('Master edition account:', masterEditionAccount.toBase58());

    // create an instruction to create the metadata account
    const createMasterEditionIx = createCreateMasterEditionV3Instruction(
      {
        edition: masterEditionAccount,
        mint: mint,
        mintAuthority: payer.publicKey,
        payer: payer.publicKey,
        updateAuthority: payer.publicKey,
        metadata: metadataAccount,
      },
      {
        createMasterEditionArgs: {
          maxSupply: 0,
        },
      },
    );

    // create the collection size instruction
    const collectionSizeIX = createSetCollectionSizeInstruction(
      {
        collectionMetadata: metadataAccount,
        collectionAuthority: payer.publicKey,
        collectionMint: mint,
      },
      {
        setCollectionSizeArgs: { size: 50 },
      },
    );

    try {
      // construct the transaction with our instructions, making the `payer` the `feePayer`
      const tx = new Transaction()
        .add(createMetadataIx)
        .add(createMasterEditionIx)
        .add(collectionSizeIX);
      tx.feePayer = payer.publicKey;

      // send the transaction to the cluster
      const txSignature = await sendAndConfirmTransaction(
        connection,
        tx,
        [payer],
        {
          commitment: 'confirmed',
          skipPreflight: true,
        },
      );

      console.log('\nCollection successfully created!', txSignature);
      //   console.log(explorerURL({ txSignature }));
    } catch (err) {
      console.error('\nFailed to create collection:', err);

      // log a block explorer link for the failed transaction
      //   await extractSignatureFromFailedTransaction(connection, err);

      throw err;
    }

    // return all the accounts
    return {
      mint,
      tokenAccount,
      metadataAccount,
      masterEditionAccount,
    };
  }

  async mintCompressedNFT(
    connection: Connection,
    payer: Keypair,
    treeAddress: PublicKey,
    collectionMint: PublicKey,
    collectionMetadata: PublicKey,
    collectionMasterEditionAccount: PublicKey,
    compressedNFTMetadata: MetadataArgs,
    receiverAddress?: PublicKey,
  ) {
    // derive the tree's authority (PDA), owned by Bubblegum
    const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
      [treeAddress.toBuffer()],
      BUBBLEGUM_PROGRAM_ID,
    );

    // derive a PDA (owned by Bubblegum) to act as the signer of the compressed minting
    const [bubblegumSigner, _bump2] = PublicKey.findProgramAddressSync(
      // `collection_cpi` is a custom prefix required by the Bubblegum program
      [Buffer.from('collection_cpi', 'utf8')],
      BUBBLEGUM_PROGRAM_ID,
    );

    // create an array of instruction, to mint multiple compressed NFTs at once
    const mintIxs: TransactionInstruction[] = [];

    /**
     * correctly format the metadata args for the nft to mint
     * ---
     * note: minting an nft into a collection (via `createMintToCollectionV1Instruction`)
     * will auto verify the collection. But, the `collection.verified` value inside the
     * `metadataArgs` must be set to `false` in order for the instruction to succeed
     */
    const metadataArgs = Object.assign(compressedNFTMetadata, {
      collection: { key: collectionMint, verified: false },
    });

    /**
     * compute the data and creator hash for display in the console
     *
     * note: this is not required to do in order to mint new compressed nfts
     * (since it is performed on chain via the Bubblegum program)
     * this is only for demonstration
     */
    const computedDataHash = new PublicKey(
      computeDataHash(metadataArgs),
    ).toBase58();
    const computedCreatorHash = new PublicKey(
      computeCreatorHash(metadataArgs.creators),
    ).toBase58();
    console.log('computedDataHash:', computedDataHash);
    console.log('computedCreatorHash:', computedCreatorHash);

    /*
    Add a single mint to collection instruction 
    ---
    But you could all multiple in the same transaction, as long as your 
    transaction is still within the byte size limits
  */
    mintIxs.push(
      createMintToCollectionV1Instruction(
        {
          payer: payer.publicKey,

          merkleTree: treeAddress,
          treeAuthority,
          treeDelegate: payer.publicKey,

          // set the receiver of the NFT
          leafOwner: receiverAddress || payer.publicKey,
          // set a delegated authority over this NFT
          leafDelegate: payer.publicKey,

          /*
            You can set any delegate address at mint, otherwise should 
            normally be the same as `leafOwner`
            NOTE: the delegate will be auto cleared upon NFT transfer
            ---
            in this case, we are setting the payer as the delegate
          */

          // collection details
          collectionAuthority: payer.publicKey,
          collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
          collectionMint: collectionMint,
          collectionMetadata: collectionMetadata,
          editionAccount: collectionMasterEditionAccount,

          // other accounts
          compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
          logWrapper: SPL_NOOP_PROGRAM_ID,
          bubblegumSigner: bubblegumSigner,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        },
        {
          metadataArgs,
        },
      ),
    );

    try {
      // construct the transaction with our instructions, making the `payer` the `feePayer`
      const tx = new Transaction().add(...mintIxs);
      tx.feePayer = payer.publicKey;

      // send the transaction to the cluster
      const txSignature = await sendAndConfirmTransaction(
        connection,
        tx,
        [payer],
        {
          commitment: 'confirmed',
          skipPreflight: true,
        },
      );

      console.log('\nSuccessfully minted the compressed NFT!');
      //   console.log(explorerURL({ txSignature }));

      return txSignature;
    } catch (err) {
      console.error('\nFailed to mint compressed NFT:', err);

      // log a block explorer link for the failed transaction
      //   await extractSignatureFromFailedTransaction(connection, err);

      throw err;
    }
  }

  async mintCompressedNFTV2(
    connection: Connection,
    payer: Keypair,
    treeAddress: PublicKey,
    collectionMint: PublicKey,
    collectionMetadata: PublicKey,
    collectionMasterEditionAccount: PublicKey,
    compressedNFTMetadata: MetadataArgs,
    receiverAddress?: PublicKey,
  ) {
    // derive the tree's authority (PDA), owned by Bubblegum
    const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
      [treeAddress.toBuffer()],
      BUBBLEGUM_PROGRAM_ID,
    );

    // derive a PDA (owned by Bubblegum) to act as the signer of the compressed minting
    const [bubblegumSigner, _bump2] = PublicKey.findProgramAddressSync(
      // `collection_cpi` is a custom prefix required by the Bubblegum program
      [Buffer.from('collection_cpi', 'utf8')],
      BUBBLEGUM_PROGRAM_ID,
    );

    // create an array of instruction, to mint multiple compressed NFTs at once
    const mintIxs: TransactionInstruction[] = [];

    /**
     * correctly format the metadata args for the nft to mint
     * ---
     * note: minting an nft into a collection (via `createMintToCollectionV1Instruction`)
     * will auto verify the collection. But, the `collection.verified` value inside the
     * `metadataArgs` must be set to `false` in order for the instruction to succeed
     */
    const metadataArgs = Object.assign(compressedNFTMetadata, {
      collection: { key: collectionMint, verified: false },
    });

    /*
    Add a single mint to collection instruction 
    ---
    But you could all multiple in the same transaction, as long as your 
    transaction is still within the byte size limits
  */
    mintIxs.push(
      createMintToCollectionV1Instruction(
        {
          payer: payer.publicKey,

          merkleTree: treeAddress,
          treeAuthority,
          treeDelegate: payer.publicKey,

          // set the receiver of the NFT
          leafOwner: receiverAddress || payer.publicKey,
          // set a delegated authority over this NFT
          leafDelegate: payer.publicKey,

          /*
            You can set any delegate address at mint, otherwise should 
            normally be the same as `leafOwner`
            NOTE: the delegate will be auto cleared upon NFT transfer
            ---
            in this case, we are setting the payer as the delegate
          */

          // collection details
          collectionAuthority: payer.publicKey,
          collectionAuthorityRecordPda: BUBBLEGUM_PROGRAM_ID,
          collectionMint: collectionMint,
          collectionMetadata: collectionMetadata,
          editionAccount: collectionMasterEditionAccount,

          // other accounts
          compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
          logWrapper: SPL_NOOP_PROGRAM_ID,
          bubblegumSigner: bubblegumSigner,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        },
        {
          metadataArgs,
        },
      ),
    );

    try {
      // construct the transaction with our instructions, making the `payer` the `feePayer`
      const tx = new Transaction().add(...mintIxs);
      tx.feePayer = payer.publicKey;

      // send the transaction to the cluster
      const txSignature = await sendAndConfirmTransaction(
        connection,
        tx,
        [payer],
        {
          commitment: 'confirmed',
          skipPreflight: true,
        },
      );

      const txInfo = await connection.getTransaction(txSignature, {
        maxSupportedTransactionVersion: 0,
      });

      // find the index of the bubblegum instruction
      const relevantIndex =
        txInfo!.transaction.message.compiledInstructions.findIndex(
          (instruction) => {
            return (
              txInfo?.transaction.message.staticAccountKeys[
                instruction.programIdIndex
              ].toBase58() === 'BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY'
            );
          },
        );

      // locate the no-op inner instructions called via cpi from bubblegum
      const relevantInnerIxs = txInfo!.meta?.innerInstructions?.[
        relevantIndex
      ].instructions.filter((instruction) => {
        return (
          txInfo?.transaction.message.staticAccountKeys[
            instruction.programIdIndex
          ].toBase58() === 'noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV'
        );
      });

      // when no valid noop instructions are found, throw an error
      if (!relevantInnerIxs || relevantInnerIxs.length == 0)
        throw Error('Unable to locate valid noop instructions');

      // locate the asset index by attempting to locate and parse the correct `relevantInnerIx`
      let assetIndex: number | undefined = undefined;
      // note: the `assetIndex` is expected to be at position `1`, and normally expect only 2 `relevantInnerIx`
      for (let i = relevantInnerIxs.length - 1; i > 0; i--) {
        try {
          const changeLogEvent = deserializeChangeLogEventV1(
            Buffer.from(base58.decode(relevantInnerIxs[i]?.data!)),
          );

          // extract a successful changelog index
          assetIndex = changeLogEvent?.index;
        } catch (__) {
          // do nothing, invalid data is handled just after the for loop
        }
      }

      // when no `assetIndex` was found, throw an error
      if (typeof assetIndex == 'undefined')
        throw Error('Unable to locate the newly minted assetId ');

      const assetId = await getLeafAssetId(treeAddress, new BN(assetIndex));

      return { mint: assetId, signature: txSignature };
    } catch (err) {
      console.error('\nFailed to mint compressed NFT:', err);
      throw err;
    }
  }
}

function getAssetPDA(tree: PublicKey, leafIndex: number): PublicKey {
  const [asset] = PublicKey.findProgramAddressSync(
    [
      Buffer.from('asset', 'utf8'),
      tree.toBuffer(),
      Uint8Array.from(new BN(leafIndex).toArray('le', 8)),
    ],
    BUBBLEGUM_PROGRAM_ID,
  );
  return asset;
}

export function getBubblegumAuthorityPDA(
  merkleRollPubKey: PublicKey,
): PublicKey {
  const [bubblegumAuthorityPDAKey] = PublicKey.findProgramAddressSync(
    [merkleRollPubKey.toBuffer()],
    BUBBLEGUM_PROGRAM_ID,
  );
  return bubblegumAuthorityPDAKey;
}

async function getTreeNonceCount(
  connection: Connection,
  tree: PublicKey,
): Promise<BN> {
  const treeAuthority = getBubblegumAuthorityPDA(tree);
  return new BN(
    (await TreeConfig.fromAccountAddress(connection, treeAuthority)).numMinted,
  );
}
