import { z } from 'zod';

const createPostCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
  }),
});

const updatePostCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
  }),
});

export const PostCategoryValidation = {
  createPostCategoryValidationSchema,
  updatePostCategoryValidationSchema,
};
