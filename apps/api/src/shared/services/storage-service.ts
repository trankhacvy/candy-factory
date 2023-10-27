import { Injectable } from '@nestjs/common';
import { NodeBundlr, WebBundlr } from '@bundlr-network/client';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ConnectionService } from './connection-service';

@Injectable()
export class StorageService {
  constructor(
    private connectionService: ConnectionService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async upload(data: Express.Multer.File) {
    try {
      const bundlr = new NodeBundlr(
        this.configService.getOrThrow('solana.bundlr', { infer: true }),
        'solana',
        this.connectionService.feePayer.secretKey,
        {
          providerUrl: this.configService.getOrThrow('solana.rpc', {
            infer: true,
          }),
        },
      );

      await bundlr.ready();

      if (!bundlr) {
        throw new Error('Bundlr not initialized');
      }
      // if (typeof data === 'object') {
      //   data = JSON.stringify(data);
      // }
      const tags = [{ name: 'Content-Type', value: data.mimetype }];
      const transaction = bundlr.createTransaction(data.buffer, {
        tags,
      });
      try {
        await transaction.sign();
        await transaction.upload();
      } catch (e: any) {
        console.log('check e: ', e.message);
        if (e.message.includes('Not enough funds to send data')) {
          const price = await bundlr.getPrice(data.buffer.length);
          const minimumFunds = price.multipliedBy(1);
          const balance = await bundlr.getBalance(
            this.connectionService.feePayer.publicKey.toBase58(),
          );
          console.log('balance: ', balance.toNumber());
          console.log('minimumFunds: ', minimumFunds.toNumber());
          if (balance.isLessThanOrEqualTo(minimumFunds)) {
            await bundlr.fund(minimumFunds.multipliedBy(10));
          }

          // Retry signing and uploading after funding
          await transaction.sign();
          await transaction.upload();
        } else {
          throw e;
        }
      }

      const id = transaction.id;

      if (!id) {
        throw new Error('Transaction ID not found');
      }

      const url = `https://arweave.net/${id}`;
      const signature = transaction.signature;
      return { url, id, signature, error: null };
    } catch (error) {
      throw error;
    }
  }

  async uploadMetadata(data: Record<string, any>) {
    try {
      const bundlr = new NodeBundlr(
        this.configService.getOrThrow('solana.bundlr', { infer: true }),
        'solana',
        this.connectionService.feePayer.secretKey,
        {
          providerUrl: this.configService.getOrThrow('solana.rpc', {
            infer: true,
          }),
        },
      );

      await bundlr.ready();

      if (!bundlr) {
        throw new Error('Bundlr not initialized');
      }
      // if (typeof data === 'object') {
      //   data = JSON.stringify(data);
      // }
      const tags = [{ name: 'Content-Type', value: 'application/json' }];
      const transaction = bundlr.createTransaction(JSON.stringify(data), {
        tags,
      });
      try {
        await transaction.sign();
        await transaction.upload();
      } catch (e: any) {
        console.log('check e: ', e.message);
        if (e.message.includes('Not enough funds to send data')) {
          const price = await bundlr.getPrice(JSON.stringify(data).length);
          const minimumFunds = price.multipliedBy(1);
          const balance = await bundlr.getBalance(
            this.connectionService.feePayer.publicKey.toBase58(),
          );
          console.log('balance: ', balance);
          console.log('minimumFunds: ', minimumFunds);
          console.log('need fund: xxxx');
          console.log('need fund: ', balance.isLessThanOrEqualTo(minimumFunds));

          if (balance.isLessThanOrEqualTo(minimumFunds)) {
            console.log('funding');
            await bundlr.fund(minimumFunds.multipliedBy(10));
            // @ts-ignore
            await new Promise((resolve) => setTimeout(() => resolve(), 200));
          }

          // Retry signing and uploading after funding
          console.log('resign');
          await transaction.sign();
          await transaction.upload();
        } else {
          console.error(e);
          throw e;
        }
      }

      const id = transaction.id;

      if (!id) {
        throw new Error('Transaction ID not found');
      }

      const url = `https://arweave.net/${id}`;
      const signature = transaction.signature;
      return { url, id, signature, error: null };
    } catch (error) {
      throw error;
    }
  }
}
