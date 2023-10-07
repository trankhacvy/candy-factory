import type {
  DataSource,
  EntitySubscriberInterface,
  UpdateEvent,
} from 'typeorm';

import { Audience } from 'src/audiences/entities/audience.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  CampaignTransaction,
  CampaignTxStatus,
} from 'src/campaigns/entities/campaign-transactions.entity';
import { CampaignsService } from 'src/campaigns/campaigns.service';

@Injectable()
export class CampaignTxSubscriber
  implements EntitySubscriberInterface<CampaignTransaction>
{
  constructor(
    @InjectDataSource() readonly dataSource: DataSource,
    private campaignsService: CampaignsService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo(): typeof Audience {
    return Audience;
  }

  afterUpdate(event: UpdateEvent<CampaignTransaction>) {
    console.log(`AFTER ENTITY UPDATED: `, event.entity?.id);
    if (
      event.entity?.id &&
      event.entity?.campaignId &&
      event.entity?.status === CampaignTxStatus.SUCCESS
    ) {
      this.campaignsService
        .findOne({ id: event.entity.campaignId })
        .then((campaign) =>
          this.campaignsService.update(campaign.id, {
            mintedNft: campaign.mintedNft + 1,
          }),
        );
    }
  }
}
