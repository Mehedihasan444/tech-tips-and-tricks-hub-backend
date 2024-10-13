import meiliClient from '../../utils/meilisearch';

const getAllPosts = async (limit: number, searchTerm?: string) => {
  const index = meiliClient?.index('posts');

  if (!index) {
    throw new Error('MeiliSearch client or index not found');
  }

  const searchString = searchTerm || '';

  try {
    const result = await index.search(searchString, { limit });
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error searching MeiliSearch:', error);
    throw error;
  }
};

export const MeilisearchServices = {
  getAllPosts,
};