import type {
  DataSource,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';

import { Audience } from 'src/audiences/entities/audience.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { AudienceGroupsService } from 'src/audience-groups/audience-groups.service';

@Injectable()
export class AudienceSubscriber implements EntitySubscriberInterface<Audience> {
  constructor(
    @InjectDataSource() readonly dataSource: DataSource,
    private audienceGroupsService: AudienceGroupsService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo(): typeof Audience {
    return Audience;
  }

  afterInsert(event: InsertEvent<Audience>): void {
    if (event.entity.group) {
      console.log('afterInsert', event.entity);
      this.audienceGroupsService.increaseAudience(event.entity.group.id);
    }
  }

  afterRemove(event: RemoveEvent<Audience>): void {
    if (event.entity?.group) {
      console.log('afterRemove', event.entity);
      this.audienceGroupsService.decreaseAudience(event.entity.group.id);
    }
  }
}
