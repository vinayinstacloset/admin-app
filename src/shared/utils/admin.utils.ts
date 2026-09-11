export const sanitizeMobile = (value: string): string => value.replace(/\D/g, "").slice(0, 10);
export const isValidMobile = (value: string): boolean => /^[6-9]\d{9}$/.test(value);
export const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const isNonEmpty = (value: string): boolean => value.trim().length > 0;
