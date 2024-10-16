import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { MeilisearchRoutes } from "../modules/Meilisearch/meilisearch.routes";
import { UserRoutes } from "../modules/User/user.route";
import { ImageUploadRoutes } from "../modules/ImageUpload/imageUpload.routes";
import { PostRoutes } from "../modules/Post/post.route";
import { PaymentRoutes } from "../modules/Payment/payment.route";
import { CommentRoutes } from "../modules/Comment/comment.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/posts",
    route: PostRoutes,
  },
  {
    path: "/search-posts",
    route: MeilisearchRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/comments",
    route: CommentRoutes,
  },

  {
    path: "/image-upload",
    route: ImageUploadRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
