import crypto from 'crypto';

export const getGravatarURL = (email) =>
  `https://www.gravatar.com/avatar/${crypto
    .createHash('md5')
    .update(email)
    .digest('hex')}`;
