import { TComment } from "./comment.interface";
import { Comment } from "./comment.model";

import mongoose, { Types } from "mongoose";

const createCommentIntoDB = async (payload: any) => {
  if (payload.commentId) {
    const { commentId, data } = payload; // `data` contains new comment details

    // Step 1: Find the root comment or immediate parent comment using the postId or commentId
    const rootComment = await Comment.findOne({ postId: data.postId }).exec();

    if (!rootComment) {
      throw new Error("Root comment (post) not found");
    }

    // Step 2: Recursive function to find immediate parent comment
    const findImmediateParent = (
      parentComment: typeof rootComment,
      targetCommentId: Types.ObjectId
    ): typeof rootComment | null => {
      // Check if current comment is the immediate parent
      if (parentComment._id.toString() === targetCommentId.toString()) {
        return parentComment;
      }

      // Traverse the children to find the target parent comment
      if (parentComment?.children) {
        for (let child of parentComment?.children) {
          const foundComment = findImmediateParent(
            child as any,
            targetCommentId
          );
          if (foundComment) {
            return foundComment;
          }
        }
      }

      return null;
    };

    // Find the immediate parent comment in the nested structure
    const immediateParentComment = findImmediateParent(rootComment, commentId);

    if (!immediateParentComment) {
      throw new Error("Immediate parent comment not found");
    }

    // Step 3: Create the new comment object (to be embedded in the children array)
    const newComment = {
      _id: new mongoose.Types.ObjectId(),
      postId: data.postId, // The same postId as the root post
      commentText: data.commentText,
      commentUser: data.commentUser,
      createdAt: String(new Date()),
      children: [], // Initialize an empty array for future children
    };

    // Step 4: Push the new comment into the immediate parent's `children` array
    immediateParentComment.children?.push(newComment);

    // Save the updated root comment with nested comment embedded in `children`
    await rootComment.save();

    return newComment;
  } else {
    // If there is no parent comment, just create the comment
    const result = await Comment.create(payload);
    return result;
  }
};

const getAllCommentsOfASinglePostFromDB = async (postId: string) => {
  try {
    const result = await Comment.find({ postId })
      .populate("commentUser")
      .populate({
        path: "children",
        populate: {
          path: "commentUser", // Populate commentUser for each child
        },
      });

    return result;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Could not retrieve comments from the database.");
  }
};

const getSingleCommentFromDB = async (commentId: string) => {
  const result = await Comment.findById(commentId)
    .populate("commentUser")
    .populate("children"); // Use commentUser for population
  return result;
};
const updateCommentInDB = async (commentId: string, payload: TComment) => {
  const result = await Comment.findByIdAndUpdate(commentId, payload, {
    new: true,
  });

  return result;
};

const deleteCommentFromDB = async (commentId: string) => {
  const result = await Comment.findByIdAndDelete(commentId);
  const deletedPostId = result?._id;

  return result;
};

export const CommentServices = {
  createCommentIntoDB,
  getAllCommentsOfASinglePostFromDB,
  getSingleCommentFromDB,
  updateCommentInDB,
  deleteCommentFromDB,
};
