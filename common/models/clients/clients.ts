import { IClientWithoutStatus } from './client-without-status';

export interface IClient extends IClientWithoutStatus {
  status: string;
}
