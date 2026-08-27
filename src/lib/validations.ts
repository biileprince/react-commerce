import { z } from 'zod';


export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(60, 'Name must be less than 60 characters')
      .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;


const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Eastern',
  'Central',
  'Northern',
  'Upper East',
  'Upper West',
  'Volta',
  'Brong-Ahafo',
  'Oti',
  'Savannah',
  'North East',
  'Bono',
  'Bono East',
  'Western North',
] as const;

export const addressSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Name is too long'),
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(
      /^(\+233|0)[2-9]\d{8}$/,
      'Please enter a valid Ghanaian phone number (e.g. 0244123456)'
    ),
  addressLine1: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(120, 'Address is too long'),
  addressLine2: z.string().max(120).optional().or(z.literal('')),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(60, 'City name is too long'),
  region: z.enum(GHANA_REGIONS, 'Please select a valid region'),
  district: z.string().max(60).optional().or(z.literal('')),
  landmark: z.string().max(120).optional().or(z.literal('')),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
export { GHANA_REGIONS };


export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'rating']).optional(),
});
