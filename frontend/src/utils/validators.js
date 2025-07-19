export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^(\+92|0)[0-9]{10}$/;
  return re.test(phone);
};

export const validateRequired = (value) => {
  return value.trim() !== '';
};

export const validateNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const validatePositiveNumber = (value) => {
  return validateNumber(value) && parseFloat(value) >= 0;
};

export const validatePrice = (value) => {
  return validatePositiveNumber(value) && parseFloat(value) > 0;
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateDate = (date) => {
  return !isNaN(Date.parse(date));
};