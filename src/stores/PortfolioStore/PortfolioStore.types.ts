import type { ICoin } from '@stores/sharedTypes';

export interface IHolding {
  coin: ICoin;
  quantity: number;
  price: number;
}
