import { QueryBuilder } from '../../builder/QueryBuilder';
import { TImageFiles } from '../../interfaces/image.interface';
import {
  addDocumentToIndex,
  deleteDocumentFromIndex,
} from '../../utils/meilisearch';
import { PostsSearchableFields } from './post.constant';
import { TPost } from './post.interface';
import { Post } from './post.model';
import { SearchPostByCategoryQueryMaker, SearchPostByDateRangeQueryMaker, SearchPostByUserQueryMaker } from './post.utils';


const createPostIntoDB = async (payload: TPost, images: TImageFiles) => {
  const { postImages } = images;
  payload.images = postImages.map((image) => image.path);

  const result = await Post.create(payload);

  await addDocumentToIndex(result, 'posts');
  return result;
};
const updatePostInDB = async (postId: string, payload: TPost,images: TImageFiles) => {
  if (images) {
    
    const { postImages } = images;
    const previousImages= payload.images||[];
    const newImages=postImages.map((image) => image.path)||[];
    payload.images = [...previousImages,...newImages]
  }

  const result = await Post.findByIdAndUpdate(postId, payload, { new: true });
  if (result) {
    await addDocumentToIndex(result, 'posts');
  } else {
    throw new Error(`Post with ID ${postId} not found.`);
  }
  return result;
};

const getAllPostsFromDB = async (query: Record<string, unknown>) => {
  query = (await SearchPostByUserQueryMaker(query)) || query;

  // Date range search
  query = (await SearchPostByDateRangeQueryMaker(query)) || query;

  query = (await SearchPostByCategoryQueryMaker(query)) || query;

  const postQuery = new QueryBuilder(
    Post.find()
    .populate('author')
    .populate('category'),
    query
  )
    .filter()
    .search(PostsSearchableFields)
    .sort()
    .paginate()
    .fields();

  const result = await postQuery.modelQuery;

  return result;
};

const getPostFromDB = async (postId: string) => {
  const result = await Post.findById(postId)
    .populate('author')
    .populate('category');
  return result;
};


const deletePostFromDB = async (postId: string) => {
  const result = await Post.findByIdAndDelete(postId);
  const deletedPostId = result?._id;
  if (deletedPostId) {
    await deleteDocumentFromIndex('posts', deletedPostId.toString());
  }

  return result;
};

export const PostServices = {
  createPostIntoDB,
  getAllPostsFromDB,
  getPostFromDB,
  updatePostInDB,
  deletePostFromDB,
};