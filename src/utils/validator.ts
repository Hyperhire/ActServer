export const validatePassword = password => {
  if (password.length > 15) return false;
  if (password.length < 8) return false;
  if (!password.match(/^.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*$/)) return false;
  return true;
};
