import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import * as bs58 from 'bs58';
import { AllConfigType } from 'src/config/config.type';

@Injectable()
export class ConnectionService {
  private connection: Connection;

  private payer: Keypair;

  private masterTree: PublicKey;

  constructor(private configService: ConfigService<AllConfigType>) {
    this.connection = new Connection(
      this.configService.getOrThrow('solana.rpc', { infer: true }),
      'confirmed',
    );

    this.payer = Keypair.fromSecretKey(
      bs58.decode(
        this.configService.getOrThrow('solana.masterWallet', {
          infer: true,
        }),
      ),
    );

    this.masterTree = new PublicKey(
      this.configService.getOrThrow('solana.masterTree', { infer: true }),
    );
  }

  get feePayer(): Keypair {
    return this.payer;
  }

  get tree(): PublicKey {
    return this.masterTree;
  }

  getConnection(): Connection {
    return this.connection;
  }
}
