import { z } from 'zod';
import { USER_ROLE, USER_STATUS } from './user.constant';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    role: z.nativeEnum(USER_ROLE),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({
        message: 'Invalid email',
      }),
    password: z.string({
      required_error: 'Password is required',
    }),
    status: z.nativeEnum(USER_STATUS).default(USER_STATUS.ACTIVE),
    mobileNumber: z.string().optional(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    role: z.nativeEnum(USER_ROLE).optional(),
    email: z.string().email().optional(),
    password: z.string().optional(),
    status: z.nativeEnum(USER_STATUS).optional(),
    mobileNumber: z.string().optional(),
    profilePhoto: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
    gender: z.string().optional().nullable(),
    maritalStatus: z.string().optional().nullable(),
    education: z
      .array(
        z.object({
          degree: z.string(),
          institution: z.string(),
          gpa: z.string(),
          startDate: z.string(),
          endDate: z.string(),
        })
      )
      .optional()
      .default([]),
    socialMedia: z
      .array(
        z.object({
          platform: z.string(),
          url: z.string({message:"Invalid URL format"}),
        })
      )
      .optional()
      .default([]),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};