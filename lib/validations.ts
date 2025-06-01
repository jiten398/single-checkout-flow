import { z } from 'zod';

// Helper function to validate expiry date
const validateExpiryDate = (value: string) => {
  const [month, year] = value.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100; // Get last 2 digits of year
  const currentMonth = currentDate.getMonth() + 1;
  
  const expMonth = parseInt(month);
  const expYear = parseInt(year);
  
  // Check if year is in the past
  if (expYear < currentYear) return false;
  
  // If same year, check if month is in the past
  if (expYear === currentYear && expMonth < currentMonth) return false;
  
  return true;
};

// Helper function to validate phone number format
const validatePhoneNumber = (value: string) => {
  // Remove all non-digits
  const digitsOnly = value.replace(/\D/g, '');
  return digitsOnly.length === 10;
};

// Helper function to validate card number (Luhn algorithm)
const validateCardNumber = (value: string) => {
  // Remove all non-digits
  const digitsOnly = value.replace(/\D/g, '');
  
  if (digitsOnly.length !== 16) return false;
  
  // Simple Luhn algorithm implementation
  let sum = 0;
  let isEven = false;
  
  for (let i = digitsOnly.length - 1; i >= 0; i--) {
    let digit = parseInt(digitsOnly[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Main checkout form validation schema
export const checkoutSchema = z.object({
  // Personal Information
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email must be less than 100 characters')
    .toLowerCase(),
  
  phone: z.string()
    .refine(validatePhoneNumber, 'Phone number must be 10 digits')
    .transform(val => val.replace(/\D/g, '')), // Store only digits
  
  // Address Information
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address must be less than 200 characters'),
  
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'City can only contain letters, spaces, hyphens, and apostrophes'),
  
  state: z.string()
    .length(2, 'State must be 2 characters (e.g., NY)')
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, 'State must be 2 uppercase letters'),
  
  zipCode: z.string()
    .regex(/^\d{5}$/, 'Zip code must be 5 digits')
    .or(z.string().regex(/^\d{5}-\d{4}$/, 'Zip code must be in format 12345 or 12345-6789')),
  
  // Payment Information
  cardNumber: z.string()
    .refine(validateCardNumber, 'Invalid card number')
    .transform(val => val.replace(/\D/g, '')), // Store only digits
  
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format')
    .refine(validateExpiryDate, 'Card has expired'),
  
  cvv: z.string()
    .regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
});

// Type inference for the form data
export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Additional validation schemas for other parts of the app

// Product selection validation
export const productSelectionSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variant: z.object({
    color: z.string().min(1, 'Color selection is required'),
    size: z.string().min(1, 'Size selection is required')
  }),
  quantity: z.number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(99, 'Quantity cannot exceed 99')
});

// Order status validation
export const orderStatusSchema = z.enum(['approved', 'declined', 'error']);

// API request validation for checkout
export const checkoutApiSchema = z.object({
  customer: checkoutSchema,
  product: z.object({
    name: z.string(),
    price: z.number().positive(),
    variant: z.object({
      color: z.string(),
      size: z.string()
    }),
    quantity: z.number().int().positive()
  }),
  paymentStatus: orderStatusSchema,
  total: z.number().positive()
});

// Utility functions for formatting

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{4})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
  }
  return cardNumber;
};

export const maskCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '');
  if (cleaned.length >= 4) {
    return `**** **** **** ${cleaned.slice(-4)}`;
  }
  return cardNumber;
};

// Validation error messages helper
export const getErrorMessage = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  return 'Invalid input';
};

// Export all schemas and types
export default {
  checkoutSchema,
  productSelectionSchema,
  orderStatusSchema,
  checkoutApiSchema
};