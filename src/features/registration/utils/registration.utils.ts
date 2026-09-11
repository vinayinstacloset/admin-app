export const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const isValidFullName = (value: string): boolean => value.trim().length >= 2;
export const isValidPassword = (value: string): boolean => value.trim().length >= 6;
