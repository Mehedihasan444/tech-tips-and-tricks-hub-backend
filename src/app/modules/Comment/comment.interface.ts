import { ObjectId } from "mongoose";

// Define the TComment type
export type TComment = {
  postId: ObjectId;
  commentText: string;
  commentUser: {
    name: string;
    photo: string;
  };
  createdAt: string;
  children?: TComment[];
};
