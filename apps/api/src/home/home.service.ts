import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { ConnectionService } from 'src/shared/services/connection-service';

@Injectable()
export class HomeService {
  constructor(
    private configService: ConfigService<AllConfigType>,
    private connectionService: ConnectionService,
  ) {}

  appInfo() {
    return {
      // name: this.configService.get('app.name', { infer: true })
      name: this.connectionService.tree.toBase58(),
    };
  }
}
