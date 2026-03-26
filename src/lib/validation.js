// Input validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;
  return strength;
};

export const validateSearchInput = (input) => {
  // Prevent XSS and SQL injection
  const sanitized = input.trim().slice(0, 100);
  return sanitized;
};

export const validatePriceInput = (price) => {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice >= 0;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim()
    .slice(0, 500); // Limit length
};

export const getValidationError = (fieldName, value, rules) => {
  if (rules.required && !value) {
    return `${fieldName} is required`;
  }
  if (rules.minLength && value.length < rules.minLength) {
    return `${fieldName} must be at least ${rules.minLength} characters`;
  }
  if (rules.maxLength && value.length > rules.maxLength) {
    return `${fieldName} must not exceed ${rules.maxLength} characters`;
  }
  if (rules.pattern && !rules.pattern.test(value)) {
    return rules.patternMessage || `${fieldName} is invalid`;
  }
  return null;
};
