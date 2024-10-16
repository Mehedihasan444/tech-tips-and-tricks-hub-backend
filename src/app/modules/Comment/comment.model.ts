// import { Schema, model } from "mongoose";
// import { TComment } from "./comment.interface";

// // Create the Mongoose schema
// const commentSchema = new Schema<TComment>(
//   {
//     postId: {
//       type: Schema.Types.ObjectId,
//       ref: "Post",
//       required: true, // A comment must belong to a specific postId, so it's required.
//     },
//     commentText: {
//       type: String,
//       required: true,
//     },
//     commentUser: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     children: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }], // Reference Comment, not User
//   },
//   {
//     timestamps: true, // This will automatically handle createdAt and updatedAt
//   }
// );

// // Export the model
// export const Comment = model<TComment>("Comment", commentSchema);
// import { Schema, model } from "mongoose";
// import { TComment } from "./comment.interface"; // Assuming this interface is defined correctly

// // Create the schema for child comments
// const childCommentSchema = new Schema(
//   {
//     _id: { type: Schema.Types.ObjectId, required: true }, // Use String for _id if you're assigning custom IDs
//     postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
//     commentText: { type: String, required: true },
//     commentUser: { type: Schema.Types.ObjectId, ref: "User", required: true },
//     createdAt: { type: String, readonly: true },
//     // Children can be an array of child comment objects
//     children: [ // Embedding the same comment schema for nested comments
//       {
//         _id: { type: Schema.Types.ObjectId, required: true },
//         postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
//         commentText: { type: String, required: true },
//         commentUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//         createdAt: { type: String, readonly: true },
//         children: []
//       }
//     ], // This refers to the same schema, allowing for nested comments
//   },
//   { _id: false } // Prevent automatic generation of _id for this schema
// );

// // Create the main comment schema
// const commentSchema = new Schema<TComment>(
//   {
//     postId: {
//       type: Schema.Types.ObjectId,
//       ref: "Post",
//       required: true, // A comment must belong to a specific postId, so it's required.
//     },
//     commentText: {
//       type: String,
//       required: true,
//     },
//     commentUser: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     createdAt: {
//       type: String,
//       required: true,
//     },
//     // Store children as an array of child comment objects
//     children: [childCommentSchema,],
//   },
//   {
//     timestamps: true, // This will automatically handle createdAt and updatedAt
//   }
// );

// // Export the model
// export const Comment = model<TComment>("Comment", commentSchema);
import { Schema, model } from "mongoose";
import { TComment } from "./comment.interface"; // Assuming this interface is defined correctly

// Define the schema for the embedded child comments
let childCommentSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true }, // Use String for _id if you're assigning custom IDs
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  commentText: { type: String, required: true },
  commentUser: {
    type: {
      name: String,
      photo: String,
    },
    required: true,
  },
  createdAt: { type: String, required: true },
  // children: [this as typeof childCommentSchema], // Embedding the same schema recursively for nested children
});
childCommentSchema.add({ children: [childCommentSchema] });

// Define the main comment schema
let commentSchema = new Schema<TComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    commentText: { type: String, required: true },
    commentUser: {
      type: {
        name: String,
        photo: String,
      },
      required: true,
    },
    createdAt: { type: String, required: true },
    // Store children as an array of embedded child comment objects
    children: [{ type: childCommentSchema, default: [] }], // Embedded array of child comments
  },
  {
    timestamps: true, // This will automatically handle createdAt and updatedAt
  }
);

// Export the model
export const Comment = model<TComment>("Comment", commentSchema);
