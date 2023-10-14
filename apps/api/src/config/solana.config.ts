import { registerAs } from '@nestjs/config';
import { SolanaConfig } from './config.type';
import { IsNumber, IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  SOLANA_RPC_URL: string;

  @IsString()
  SOLANA_CLUSTER: string;

  @IsString()
  MASTER_WALLET: string;

  @IsString()
  MASTER_TREE: string;

  @IsString()
  BUNDLR_URL: string;

  @IsString()
  SHYFT_API_KEY: string;

  @IsNumber()
  NFT_PRICE: number;
}

export default registerAs<SolanaConfig>('solana', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    rpc: process.env.SOLANA_RPC_URL,
    cluster: process.env.SOLANA_CLUSTER,
    // keys
    masterWallet: process.env.MASTER_WALLET,
    masterTree: process.env.MASTER_TREE,
    // storage
    bundlr: process.env.BUNDLR_URL,
    // shyft
    shyftApikey: process.env.SHYFT_API_KEY,
    // pricing
    nftPrice: process.env.NFT_PRICE
      ? parseFloat(process.env.NFT_PRICE)
      : 0.00005,
  };
});
