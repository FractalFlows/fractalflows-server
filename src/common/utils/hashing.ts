import bcrypt from 'bcrypt';

export const hash = async (text) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(text, salt);
  return hash;
};

export const compareHash = async (text, hashword) => {
  const isSame = await bcrypt.compare(text, hashword);
  return isSame;
};
