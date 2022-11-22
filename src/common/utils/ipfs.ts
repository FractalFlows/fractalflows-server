export const getCIDFromIPFSURI = (uri) => uri.split('/')?.[2];
export const getFilenameFromIPFSURI = (uri) => uri.split('/')?.[3];
export const getCIDAndFilenameFromIPFSURI = (uri) =>
  uri.replace(/^ipfs:\/\//, '');
