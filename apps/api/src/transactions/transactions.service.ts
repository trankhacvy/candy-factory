import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsOrder, Raw, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { PageOptionsDto } from 'src/utils/dtos/page-options.dto';
import { PageMetaDto } from 'src/utils/dtos/page-meta.dto';
import { PageDto } from 'src/utils/dtos/page.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {}

  async create(dto: CreateTransactionDto, user: User): Promise<Transaction> {
    return this.transactionsRepository.save(
      this.transactionsRepository.create({
        ...dto,
        user,
      }),
    );
  }

  update(
    id: Transaction['id'],
    payload: DeepPartial<Transaction>,
  ): Promise<Transaction> {
    return this.transactionsRepository.save(
      this.transactionsRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: Transaction['id']): Promise<void> {
    await this.transactionsRepository.softDelete(id);
  }

  async findManyWithPagination(
    dto: PageOptionsDto,
    where?: EntityCondition<Transaction>,
    order: FindOptionsOrder<Transaction> = { createdAt: dto.order },
  ): Promise<PageDto<Transaction>> {
    const [result, total] = await this.transactionsRepository.findAndCount({
      where: [
        {
          signature: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:name)`, {
            name: `%${dto.q}%`,
          }),
          ...where,
        },
        {
          sender: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:name)`, {
            name: `%${dto.q}%`,
          }),
          ...where,
        },
      ],
      order,
      take: dto.take,
      skip: dto.skip,
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: dto,
    });

    return new PageDto(result, pageMetaDto);
  }

  async findOne(fields: EntityCondition<Transaction>): Promise<Transaction> {
    const tx = await this.transactionsRepository.findOne({
      where: fields,
    });

    if (!tx) throw new NotFoundException('Transaction not found');

    return tx;
  }
}
