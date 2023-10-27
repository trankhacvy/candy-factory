export type JobType = 'airdrop' | 'load_holders';

export type WaletsGroupJobType = 'load-collection-holders'


export interface JobDataModel<T> {
  type: JobType | WaletsGroupJobType;
  payload: T;
}
