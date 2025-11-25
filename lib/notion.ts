import { NotionAPI } from 'notion-client';
import { ExtendedRecordMap } from 'notion-types';
import { getDateValue, getTextContent } from 'notion-utils';

export const notion = new NotionAPI({
  activeUser: process.env.NOTION_ACTIVE_USER,
  authToken: process.env.NOTION_TOKEN_V2,
});

// Placeholder ID - User must replace this with their actual Notion Page ID for the Posts DB
export const NOTION_ROOT_PAGE_ID = process.env.NOTION_ROOT_PAGE_ID || '14e968ed5de3809d9019c8065090875e'; 

export interface Post {
  id: string;
  title: string;
  slug: string;
  status: 'Draft' | 'Published' | 'Hide';
  category: 'writing' | 'project' | 'note' | 'life' | 'about';
  tags: string[];
  summary?: string;
  thumbnail?: string;
  publishedAt: string; // ISO date string
  isPinned?: boolean;
  recordMap?: ExtendedRecordMap; // For detail view
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const recordMap = await notion.getPage(NOTION_ROOT_PAGE_ID);

    // 1. Get the collection ID (Database ID)
    const collectionId = Object.keys(recordMap.collection)[0];
    const collectionViewId = Object.keys(recordMap.collection_view)[0];
    const collection = recordMap.collection[collectionId]?.value;
    const schema = collection?.schema;

    if (!collection || !schema) {
      console.error('Notion collection not found. Check NOTION_ROOT_PAGE_ID.');
      return [];
    }

    // 2. Get all block IDs in the collection view
    // Note: This assumes the view returns all posts. Pagination might be needed for large DBs.
    const blockIds = recordMap.collection_query[collectionId]?.[collectionViewId]?.collection_group_results?.blockIds || [];

    const posts: Post[] = [];

    // 3. Map blocks to Post objects
    for (const blockId of blockIds) {
      const block = recordMap.block[blockId]?.value;
      if (!block || !block.properties) continue;

      // Helper to get property value safely
      const getProperty = (name: string) => {
        const propId = Object.keys(schema).find(key => schema[key].name === name);
        if (!propId) return null;
        return block.properties[propId];
      };

      // Extract properties
      // Get the actual page title from properties, not the database name
      const titleProperty = getProperty('Title') || getProperty('이름') || getProperty('Name') || block.properties.title;
      const title = titleProperty ? getTextContent(titleProperty) : 'Untitled';
      const slug = getTextContent(getProperty('Slug'));
      const status = getTextContent(getProperty('Status')) as Post['status'];
      const category = getTextContent(getProperty('Category')) as Post['category'];
      const tags = getTextContent(getProperty('Tags'))?.split(',').map((t: string) => t.trim()) || [];
      const summary = getTextContent(getProperty('Summary'));
      const thumbnailProperty = getProperty('Thumbnail');
      const thumbnail = thumbnailProperty?.[0]?.[1]?.[0]?.[1] || undefined; // Extract URL from Notion file property
      const publishedAt = getDateValue(getProperty('Date'))?.start_date || new Date(block.created_time).toISOString();
      const isPinned = getProperty('isPinned')?.[0]?.[0] === 'Yes'; // Checkbox or Select 'Yes'

      // Filter only Published posts
      if (status !== 'Published' || !slug) continue;

      posts.push({
        id: block.id,
        title,
        slug,
        status,
        category,
        tags,
        summary,
        thumbnail,
        publishedAt,
        isPinned,
      });
    }

    // Sort by Date desc
    return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  } catch (error) {
    console.error('Error fetching posts from Notion:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === slug);

  if (!post) return null;

  // Fetch full content for the specific post
  const recordMap = await notion.getPage(post.id);
  return { ...post, recordMap };
}

export async function getAboutContent(): Promise<Post | null> {
  const posts = await getAllPosts();
  const aboutPost = posts.find((p) => p.category === 'about');

  if (!aboutPost) return null;

  // Fetch full content for the about page
  const recordMap = await notion.getPage(aboutPost.id);
  return { ...aboutPost, recordMap };
}
