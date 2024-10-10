import { Schema, model } from 'mongoose';
import { TPost } from './post.interface';
import { postCategories, postTags } from './post.constant';
const PostSchema = new Schema<TPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // Array to store multiple image URLs if needed
    },
    // videoUrls: {
    //   type: [String], // Array to store multiple video URLs if needed
    // },
    category: {
      type: String,
      required: true,
      enum: postCategories, // Match your post categories
    },
    tags: {
      type: [String], // Array of tags
      required: true,
      enum: postTags
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User", // Assuming you have a user model
      // required: true,
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updatedAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true,
  }
);


export const Post = model<TPost>("Post", PostSchema);