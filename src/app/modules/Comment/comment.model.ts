import { model, Schema } from "mongoose";
import { TComment } from "./comment.interface";

// Define the schema for the embedded child comments
let childCommentSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true }, // Define _id explicitly
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
});
childCommentSchema.add({ children: [childCommentSchema] });

// Define the main comment schema
let commentSchema = new Schema<TComment>(
  {
    // _id: { type: Schema.Types.ObjectId }, // Define _id explicitly
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
    children: [{ type: childCommentSchema, default: [] }],
  },
  {
    timestamps: true,
  }
);
// // Export the model
export const Comment = model<TComment>("Comment", commentSchema);
// import { Schema, model } from "mongoose";
// import { TComment } from "./comment.interface"; // Assuming this interface is defined correctly

// // Define the schema for the embedded child comments
// let childCommentSchema = new Schema({
//   _id: { type: Schema.Types.ObjectId, required: true }, // Use String for _id if you're assigning custom IDs
//   postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
//   commentText: { type: String, required: true },
//   commentUser: {
//     type: {
//       name: String,
//       photo: String,
//     },
//     required: true,
//   },
//   createdAt: { type: String, required: true },
//   // children: [this as typeof childCommentSchema], // Embedding the same schema recursively for nested children
// });
// childCommentSchema.add({ children: [childCommentSchema] });

// // Define the main comment schema
// let commentSchema = new Schema<TComment>(
//   {
//     postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
//     commentText: { type: String, required: true },
//     commentUser: {
//       type: {
//         name: String,
//         photo: String,
//       },
//       required: true,
//     },
//     createdAt: { type: String, required: true },
//     // Store children as an array of embedded child comment objects
//     children: [{ type: childCommentSchema, default: [] }], // Embedded array of child comments
//   },
//   {
//     timestamps: true, // This will automatically handle createdAt and updatedAt
//   }
// );

// // Export the model
// export const Comment = model<TComment>("Comment", commentSchema);
