import { Schema, model } from 'mongoose';
import {
  PostCategoryDocument,
  PostCategoryModel,
} from './postCategory.interface';

// Define the schema
const PostCategorySchema = new Schema<PostCategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const PostCategory = model<PostCategoryDocument, PostCategoryModel>(
  'PostCategory',
  PostCategorySchema
);
