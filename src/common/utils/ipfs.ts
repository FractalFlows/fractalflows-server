export const getCIDFromIPFSURI = (uri) => uri.split('/')?.[2];
export const getFilenameFromIPFSURI = (uri) => uri.split('/')?.[3];
export const getCIDAndPathfromIPFSURI = (uri) => uri.replace('ipfs://', '');
export const getIPFSGatewayURIFromIPFSURI = (uri) =>
  `https://${getCIDFromIPFSURI(uri)}.ipfs.w3s.link/${getFilenameFromIPFSURI(
    uri,
  )}`;
