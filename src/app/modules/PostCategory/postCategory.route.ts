import express from 'express';
import { PostCategoryControllers } from './postCategory.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { PostCategoryValidation } from './postCategory.validation';

const router = express.Router();

router.get('/', PostCategoryControllers.getAllPostCategories);

router.get('/:id', PostCategoryControllers.getPostCategoryById);

router.post(
  '/',
  auth(USER_ROLE.ADMIN),
  validateRequest(PostCategoryValidation.createPostCategoryValidationSchema),
  PostCategoryControllers.createPostCategory
);

router.put(
  '/:id',
  auth(USER_ROLE.ADMIN),
  validateRequest(PostCategoryValidation.updatePostCategoryValidationSchema),
  PostCategoryControllers.updatePostCategory
);

router.delete(
  '/:id',
  auth(USER_ROLE.ADMIN),
  PostCategoryControllers.deletePostCategory
);

export const PostCategoryRoutes = router;
