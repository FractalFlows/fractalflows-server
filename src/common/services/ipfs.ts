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

  async uploadNFTMetadata(metadata: any) {
    const client = this._getNFTStorageClient();
    const result = await client.store({
      ...metadata,
      image: new File([''], 'default.jpg', { type: 'image/jpg' }),
    });

    return result.url;
  },

  async uploadClaimMetadata(claim) {
    const client = this._getNFTStorageClient();
    const metadata = await client.store({
      name: claim.title,
      description: claim.summary,

      properties: {
        tags: claim.tags,
        sources: claim.sources,
        attributions: claim.attributions,
      },
      external_uri: `${process.env.HOST}/claim/${claim.slug}`,
    });
    return metadata.url;
  },
  async uploadKnowledgeBitMetadata(knowledgeBit) {
    const client = this._getNFTStorageClient();
    const metadata = await client.store({
      name: knowledgeBit.name,
      description: knowledgeBit.summary,
      image: new File([''], 'default.jpg', { type: 'image/jpg' }),
      properties: {
        tags: knowledgeBit.side,
        sources: knowledgeBit.type,
        customType: knowledgeBit.customType,
        file: knowledgeBit.fileURI,
        attributions: knowledgeBit.attributions,
      },
    });

    return metadata.url;
  },
  async uploadArgumentMetadata(argument) {
    const client = this._getNFTStorageClient();
    const metadata = await client.store({
      name: `Argument`,
      description: argument.summary,
      image: new File([''], 'default.jpg', { type: 'image/jpg' }),
      properties: {
        side: argument.side,
      },
    });

    return metadata.url;
  },
  async uploadArgumentCommentMetadata(argumentComment) {
    const client = this._getNFTStorageClient();
    const metadata = await client.store({
      name: `Argument Comment`,
      description: argumentComment.content,
      image: new File([''], 'default.jpg', { type: 'image/jpg' }),
    });

    return metadata.url;
  },
  async uploadOpinionMetadata(opinion) {
    const client = this._getNFTStorageClient();
    const metadata = await client.store({
      name: 'Opinion',
      description: 'Opinion',
      image: new File([''], 'default.jpg', { type: 'image/jpg' }),
      properties: {
        acceptance: opinion.acceptance,
      },
    });

    return metadata.url;
  },
  async uploadFile(buffer, filename) {
    const client = this._getWeb3StorageClient();
    const file = new Web3StorageFile([buffer], filename);
    const cid = await client.put([file]);

    return `ipfs://${cid}/${filename}`;
  },
};
