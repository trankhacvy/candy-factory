import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ConnectionService } from './connection-service';
import {
  PythCluster,
  PythHttpClient,
  getPythProgramKeyForCluster,
} from '@pythnetwork/client';

const SOL_USD_SYMBOL = 'Crypto.SOL/USD';

@Injectable()
export class PythService {
  client: PythHttpClient;

  constructor(
    private connectionService: ConnectionService,
    private configService: ConfigService<AllConfigType>,
  ) {
    this.client = new PythHttpClient(
      this.connectionService.getConnection(),
      getPythProgramKeyForCluster(
        this.configService.get('solana.cluster', {
          infer: true,
        }) as PythCluster,
      ),
    );
  }

  async getSolPrice() {
    try {
      const pythData = await this.client.getData();
      const price = pythData?.productPrice?.get(SOL_USD_SYMBOL)?.price;
      if (typeof price !== 'number' || price === 0) return -1;
      return price;
    } catch (error) {
      console.error('Get Pyth price error: ', error);
      return -1;
    }
  }

  async convertUSDToSol(usd: number) {
    const solPrice = await this.getSolPrice();
    if (solPrice <= 0) return -1;

    return usd / solPrice;
  }
}
