import { POST_STATUS } from "./post.constant";

import { Document, ObjectId } from "mongoose";

export interface TPost {
  title: string;
  category: string;
  tags: string[];
  content: string;
  images?: string[]; // Optional field for image URLs
  // videoUrls?: string[]; // Optional field for video URLs
  author?: ObjectId; // This refers to the ID of the user who created the post
  status?: keyof typeof POST_STATUS;
  // createdAt: Date;
  // updatedAt: Date;
}
