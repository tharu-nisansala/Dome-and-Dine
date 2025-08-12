export const generateAdminCode = () => {
  const prefix = 'Admin';
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${randomNum}`;
};