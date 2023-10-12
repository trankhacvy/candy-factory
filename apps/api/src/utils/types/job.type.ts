export type JobType = 'airdrop' | 'load_holders';

export interface JobDataModel<T> {
  type: JobType;
  payload: T;
}
