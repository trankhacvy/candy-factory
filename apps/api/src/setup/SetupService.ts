import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/shared/services/connection-service';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { initNFT, initNFTProduction } from 'src/utils/wallet';
import { NFTsService } from 'src/nfts/nfts.service';
import { User } from 'src/users/entities/user.entity';
import { AudienceGroupsService } from 'src/audience-groups/audience-groups.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SetupService {
  constructor(
    private usersService: UsersService,
    private audienceGroupsService: AudienceGroupsService,
    private nftsService: NFTsService,
    private connectionService: ConnectionService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async initAccount(user: User) {
    const initData =
      this.configService.getOrThrow('solana.cluster', {
        infer: true,
      }) === 'devnet'
        ? initNFT
        : initNFTProduction;

    const collection = await this.nftsService.createRaw({
      name: initData.collectionName,
      symbol: initData.collectionSymbol,
      description: initData.collectionDescription,
      image: initData.collectionImage,
      metadataUri: initData.collectionMetadataUri,
      externalUrl: initData.collectionExternalUrl,
      isCollection: true,
      attributes: initData.attributes,
      creators: [],
      userId: user.id,
      royalty: 0,
      collectionAddress: initData.mintAddress,
      collectionKeys: {
        tokenAccount: initData.tokenAddress,
        masterEditionAccount: initData.masterEditionAddress,
        metadataAccount: initData.metadataAddress,
      },
    });

    await this.nftsService.createRaw({
      name: initData.name,
      symbol: initData.symbol,
      description: initData.description,
      image: initData.collectionImage,
      metadataUri: initData.metadataUri,
      externalUrl: initData.externalUrl,
      isCollection: false,
      attributes: initData.attributes,
      creators: [],
      userId: user.id,
      royalty: 0,
      collectionId: collection.id,
    });

    await this.audienceGroupsService.initGroupsWallet(user);

    await this.usersService.update(user.id, { init: true });
  }

  async getStat() {
    const metaplex = Metaplex.make(this.connectionService.getConnection(), {
      cluster: this.configService.getOrThrow('solana.cluster', { infer: true }),
    }).use(keypairIdentity(this.connectionService.feePayer));

    const {
      response,
      mintAddress,
      masterEditionAddress,
      metadataAddress,
      tokenAddress,
      nft,
    } = await metaplex.nfts().create({
      uri: initNFT.collectionMetadataUri,
      name: initNFT.collectionName,
      symbol: initNFT.collectionSymbol,
      sellerFeeBasisPoints: 0,
      isCollection: true,
    });

    console.log('response: ', response.signature);
    console.log('mintAddress: ', mintAddress.toBase58());
    console.log('masterEditionAddress: ', masterEditionAddress.toBase58());
    console.log('metadataAddress: ', metadataAddress.toBase58());
    console.log('tokenAddress: ', tokenAddress.toBase58());
  }
}
