import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { DAS, Network, ShyftSdk } from '@shyft-to/js';

const ITEM_PER_PAGE = 1000;

@Injectable()
export class CollectionService {
  constructor(private configService: ConfigService<AllConfigType>) {}

  async loadHoldersOfCollection(collection: string) {
    try {
      const shyft = new ShyftSdk({
        apiKey: this.configService.getOrThrow('solana.shyftApikey', {
          infer: true,
        }),
        network: Network.Mainnet,
      });

      let page: any = 1;
      let allNFTs: DAS.GetAssetResponse[] = [];

      while (page) {
        const response = await shyft.rpc.getAssetsByGroup({
          groupValue: collection,
          groupKey: 'collection',
          sortBy: { sortBy: 'created', sortDirection: 'asc' },
          page,
          limit: ITEM_PER_PAGE,
        });

        allNFTs.push(...response.items);

        if (response.total < ITEM_PER_PAGE) {
          page = false;
        } else {
          page++;
        }
      }

      const map = new Map<string, { address: string; total: number }>();
      for (const nft of allNFTs) {
        const owner = nft.ownership.owner;
        if (map.has(owner)) {
          map.set(owner, {
            address: owner,
            total: (map.get(owner)?.total ?? 0) + 1,
          });
        } else {
          map.set(owner, { address: owner, total: 1 });
        }
      }

      return Array.from(map.values()).sort(
        (item1, item2) => item2.total - item1.total,
      );
    } catch (error) {
      throw error;
    }
  }
}
