export const JOBS_QUEUE = 'jobs';

export enum JobTypes {
  Airdrop = 'airdrop',
  AirdropToCollection = 'airdrop-to-collection',
  WalletsGroup = 'wallets-group',
}

export type WalletsGroupJobData = {
  groupId: number;
  collection: string;
};

export interface AirdropJobData {
  nftId: number;
  dropId: number;
  dropTxId: number;
}

export interface AirdropToCollectionJobData {
  dropId: number;
  collection: string;
}
