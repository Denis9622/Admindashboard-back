export const getEnvVar = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable missing: ${key}`);
  }
  return value;
};
