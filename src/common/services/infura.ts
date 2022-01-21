import { providers } from 'ethers';

import { InfuraUtils } from '../utils/infura';

export const InfuraService = {
  getProvider: (chainId: string) =>
    new providers.JsonRpcProvider(
      {
        allowGzip: true,
        url: `${InfuraUtils.getUrl(chainId)}/${process.env.INFURA_PROJECT_ID}`,
        headers: {
          Accept: '*/*',
          Origin: process.env.ORIGIN,
          'Accept-Encoding': 'gzip, deflate, br',
          'Content-Type': 'application/json',
        },
      },
      Number.parseInt(chainId),
    ),
};
