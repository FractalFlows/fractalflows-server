export const getCIDFromIPFSURI = (uri) => uri.split('/')?.[2];
export const getFilenameFromIPFSURI = (uri) => uri.split('/')?.[3];
