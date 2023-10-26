import { Injectable } from '@nestjs/common';
import { ConnectionService } from 'src/shared/services/connection-service';
import { Metaplex, keypairIdentity } from '@metaplex-foundation/js';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { initNFT } from 'src/utils/wallet';
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
    const collection = await this.nftsService.createRaw({
      name: initNFT.collectionName,
      symbol: initNFT.collectionSymbol,
      description: initNFT.collectionDescription,
      image: initNFT.collectionImage,
      metadataUri: initNFT.collectionMetadataUri,
      externalUrl: initNFT.collectionExternalUrl,
      isCollection: true,
      attributes: initNFT.attributes,
      creators: [],
      userId: user.id,
      royalty: 0,
      collectionAddress: initNFT.mintAddress,
      collectionKeys: {
        tokenAccount: initNFT.tokenAddress,
        masterEditionAccount: initNFT.masterEditionAddress,
        metadataAccount: initNFT.metadataAddress,
      },
    });

    await this.nftsService.createRaw({
      name: initNFT.name,
      symbol: initNFT.symbol,
      description: initNFT.description,
      image: initNFT.collectionImage,
      metadataUri: initNFT.metadataUri,
      externalUrl: initNFT.externalUrl,
      isCollection: false,
      attributes: initNFT.attributes,
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
