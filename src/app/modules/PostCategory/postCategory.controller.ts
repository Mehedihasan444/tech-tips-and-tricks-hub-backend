import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PostCategoryServices } from './postCategory.service';

const createPostCategory = catchAsync(async (req, res) => {
  const PostCategory = await PostCategoryServices.createPostCategory(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post Category Created Successfully',
    data: PostCategory,
  });
});

const getAllPostCategories = catchAsync(async (req, res) => {
  const postCategory = await PostCategoryServices.getAllPostCategories(
    req.query
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post Category Retrieved Successfully',
    data: postCategory,
  });
});

const getPostCategoryById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const postCategory = await PostCategoryServices.getPostCategoryById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post Category Retrieved Successfully',
    data: postCategory,
  });
});

const updatePostCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const postCategory = await PostCategoryServices.updatePostCategory(
    id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post Category updated successfully',
    data: postCategory,
  });
});

const deletePostCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const postCategory = await PostCategoryServices.deletePostCategory(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Post Category Deleted Successfully',
    data: postCategory,
  });
});

export const PostCategoryControllers = {
  createPostCategory,
  getAllPostCategories,
  getPostCategoryById,
  updatePostCategory,
  deletePostCategory,
};
