import { NFTStorage, File } from 'nft.storage';

export const IPFS = {
  getNFTStorageClient() {
    const client = new NFTStorage({ token: process.env.NFTSTORAGE_API_KEY });
    return client;
  },
  async uploadClaimMetadata(claim) {
    const client = this.getNFTStorageClient();
    const metadata = await client.store({
      name: claim.title,
      description: claim.summary,
      image: new File([''], 'default.jpg', { type: 'image/jpg' }),
      properties: {
        tags: claim.tags,
        sources: claim.sources,
        attributions: claim.attributions,
      },
    });

    console.log(metadata);
    return metadata.url;
  },
};
