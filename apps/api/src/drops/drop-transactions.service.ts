import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { DropTransaction } from './entities/drop-transaction.entity';

@Injectable()
export class DropTransactionsService {
  constructor(
    @InjectRepository(DropTransaction)
    private dropTxsRepository: Repository<DropTransaction>,
  ) {}

  async create(
    entity: Partial<DropTransaction>,
    dropId: number,
  ): Promise<DropTransaction> {
    return this.dropTxsRepository.save(
      this.dropTxsRepository.create({
        ...entity,
        dropId,
      }),
    );
  }

  update(
    id: DropTransaction['id'],
    payload: DeepPartial<DropTransaction>,
  ): Promise<DropTransaction> {
    return this.dropTxsRepository.save(
      this.dropTxsRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async findOne(
    fields: EntityCondition<DropTransaction>,
  ): Promise<DropTransaction> {
    const drop = await this.dropTxsRepository.findOne({
      where: fields,
    });

    if (!drop) {
      throw new NotFoundException('Drop Transaction not found');
    }

    return drop;
  }
}
