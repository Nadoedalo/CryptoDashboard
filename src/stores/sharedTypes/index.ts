import type { ICoinListType } from '@stores/CoinStore';

export interface ICoin {
  id: ICoinListType['id'];
  symbol: ICoinListType['symbol'];
  name: ICoinListType['name'];
}
