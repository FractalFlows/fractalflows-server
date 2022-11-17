import { NFTStorage, File } from 'nft.storage';
import { Web3Storage, File as Web3StorageFile } from 'web3.storage';

export const IPFS = {
  _getNFTStorageClient() {
    const client = new NFTStorage({ token: process.env.NFTSTORAGE_API_KEY });
    return client;
  },
  _getWeb3StorageClient() {
    const client = new Web3Storage({ token: process.env.WEB3STORAGE_API_KEY });
    return client;
  },

  async uploadClaimMetadata(claim) {
    const client = this._getNFTStorageClient();
    const metadata = await client.store({
      name: claim.title,
      description: claim.summary,
      image: new File([''], 'default.jpg', { type: 'image/jpg' }),
      properties: {
        tags: claim.tags,
        sources: claim.sources,
        attributions: claim.attributions,
      },
      external_uri: `${process.env.HOST}/claim/${claim.slug}`,
    });

    return metadata.url;
  },
  async uploadFile(buffer, filename) {
    const client = this._getWeb3StorageClient();
    const file = new Web3StorageFile([buffer], filename);
    const cid = await client.put([file]);

    return cid;
  },
};
