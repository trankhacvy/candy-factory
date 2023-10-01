import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';
import { ConnectionService } from './services/connection-service';
import { MintNFTService } from './services/nft-mint-service';
import { StorageService } from './services/storage-service';

const providers: Provider[] = [
  ConnectionService,
  MintNFTService,
  StorageService,
];

@Global()
@Module({
  providers,
  imports: [],
  exports: providers,
})
export class SharedModule {}
