import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  const saltRounds = bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
