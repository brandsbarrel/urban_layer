import bcrypt from "bcrypt";

const PASSWORD_SALT_ROUNDS = 12;

const hashPassword = (plainTextPassword) => {
  return bcrypt.hash(plainTextPassword, PASSWORD_SALT_ROUNDS);
};

const comparePassword = (plainTextPassword, passwordHash) => {
  return bcrypt.compare(plainTextPassword, passwordHash);
};

export { hashPassword, comparePassword, PASSWORD_SALT_ROUNDS };
