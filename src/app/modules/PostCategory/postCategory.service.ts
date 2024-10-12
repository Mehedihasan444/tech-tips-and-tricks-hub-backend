import httpStatus from 'http-status';
import { QueryBuilder } from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { postCategorySearchableFields } from './postCategory.constant';
import { PostCategoryDocument, TPostCategory } from './postCategory.interface';
import { PostCategory as postCategory } from './postCategory.model';

const createPostCategory = async (PostCategory: TPostCategory) => {
  const result = await postCategory.create(PostCategory);
  return result;
};


const getAllPostCategories = async (query: Record<string, unknown>) => {
  const Posts = new QueryBuilder(postCategory.find({ isDeleted: false }), query)
    .search(postCategorySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await Posts.modelQuery;
  return result;
};

const getPostCategoryById = async (
  categoryId: string
): Promise<PostCategoryDocument | null> => {
  const isCategoryExists = await postCategory.findOne({
    _id: categoryId,
    isDeleted: false,
  });

  if (!isCategoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post Category not found!');
  }

  const category = await postCategory.findOne({
    _id: categoryId,
    isDeleted: false,
  }).exec();
  return category;
};

const updatePostCategory = async (
  id: string,
  updateData: Partial<TPostCategory>
) => {
  const isCategoryExists = await postCategory.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!isCategoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post Category not found!');
  }

  const category = await postCategory.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  return category;
};

const deletePostCategory = async (id: string) => {
  const isCategoryExists = await postCategory.findOne({
    _id: id,
    isDeleted: false,
  });
  if (!isCategoryExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post Category not found!');
  }

  const category = await postCategory.findByIdAndDelete(id);
  return category;
};

export const PostCategoryServices = {
  createPostCategory,
  getAllPostCategories,
  getPostCategoryById,
  updatePostCategory,
  deletePostCategory,
};
