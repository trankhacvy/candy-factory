export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  port: number;
  apiPrefix: string;
};

export type AuthConfig = {
  secret?: string;
  expires?: string;
  refreshSecret?: string;
  refreshExpires?: string;
};

export type DatabaseConfig = {
  url?: string;
  type?: string;
  host?: string;
  port?: number;
  password?: string;
  name?: string;
  username?: string;
  synchronize?: boolean;
  maxConnections: number;
  sslEnabled?: boolean;
  rejectUnauthorized?: boolean;
  ca?: string;
  key?: string;
  cert?: string;
};

export type SolanaConfig = {
  rpc?: string;
  cluster?: string;
  // keys
  masterWallet?: string;
  masterTree?: string;
  // storage
  bundlr?: string;
  // storage
  shyftApikey?: string;
  // pricing
  nftPrice: number
};

export type RedisConfig = {
  host?: string;
  username?: string;
  password?: string;
  port?: number;
};

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  solana: SolanaConfig;
  redis: RedisConfig;
};
