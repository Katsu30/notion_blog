import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import camelcaseKeys from 'camelcase-keys';

import { Post, PostResponse } from '@/domain/models/Post';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { DEFAULT_POSTS_COUNT } from '@/constants';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

export const getAllposts = async () => {
  if (!process.env.NOTION_DATABASE_ID) {
    console.error('ERROR: no database id');
    return;
  }

  const posts = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  return formatPostResponse(posts.results as PageObjectResponse[]);
};

const genetrateTags = (
  tags: {
    name: string;
    color: string;
  }[]
) => tags.map((tag) => tag.name);

const formatPostResponse = (posts: PageObjectResponse[]): Post[] => {
  const formatPosts: PostResponse[] = posts.map((_post) => {
    const post = camelcaseKeys(_post, { deep: true });
    return {
      id: post.id,
      url: post.url,
      title: post.properties.title,
      tags: post.properties.tags,
      slug: post.properties.slug,
      publishDate: post.properties.publishDate,
      lastEditedDate: post.properties.lastEditedDate,
    };
  });

  return formatPosts.map(
    (post): Post => ({
      id: post.id,
      url: post.url,
      title: post.title.title?.[0]?.plainText || '',
      tags: genetrateTags(post.tags.multiSelect || []) as string[],
      slug: post.slug.richText?.[0].plainText || '',
      publishDate: post.publishDate.createdTime as unknown as Date,
      lastEditedDate: post.lastEditedDate.lastEditedTime as unknown as Date,
    })
  );
};

export const getSinglePost = async (slug: string) => {
  if (!process.env.NOTION_DATABASE_ID) {
    console.error('ERROR: no database id');
    return;
  }

  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: 'slug',
      formula: {
        string: {
          equals: slug,
        },
      },
    },
  });

  const page = formatPostResponse(response.results as PageObjectResponse[])[0];
  const mbblocks = await n2m.pageToMarkdown(page.id);
  const mbString = n2m.toMarkdownString(mbblocks);

  return {
    page,
    markdown: mbString,
  };
};

export const getMultiplePosts = async (posts = DEFAULT_POSTS_COUNT) => {
  const allPosts = await getAllposts();

  if (!allPosts) {
    console.error('some errors were occured.');
    return [];
  }

  return allPosts.length === 0 ? [] : allPosts.splice(0, posts);
};

export const getPostsByPage = async (
  pageNum = 1,
  posts = DEFAULT_POSTS_COUNT
) => {
  const allPosts = await getAllposts();
  if (!allPosts) {
    console.error('some errors were occured.');
    return [];
  }

  const sliceTop = (pageNum - 1) * posts;

  return allPosts.length === 0
    ? []
    : allPosts.splice(sliceTop, sliceTop + posts);
};

export const getPostsByByTagAndPage = async (
  tagName: string,
  pageNum = 1,
  posts = DEFAULT_POSTS_COUNT
) => {
  const allPosts = await getAllposts();
  if (!allPosts) {
    console.error('some errors were occured.');
    return [];
  }

  const filteredPosts = allPosts.filter((post) =>
    post.tags.find((tag) => tag === tagName)
  );

  const sliceTop = (pageNum - 1) * posts;

  return filteredPosts.length === 0
    ? []
    : filteredPosts.splice(sliceTop, sliceTop + posts);
};

export const getMaximumPagenationNumber = async () => {
  const allPosts = await getAllposts();

  if (!allPosts) {
    console.error('some errors were occured.');
    return 1;
  }

  return allPosts.length > 0
    ? Math.ceil(allPosts.length / DEFAULT_POSTS_COUNT)
    : 1;
};

export const getMaximumPagenationNumberByTag = async (tag: string) => {
  const allPosts = await getAllposts();

  if (!allPosts) {
    console.error('some errors were occured.');
    return 1;
  }

  const filteredByTag = allPosts.filter((post) => {
    return post.tags.some((t) => t === tag);
  });

  return filteredByTag.length > 0
    ? Math.ceil(filteredByTag.length / DEFAULT_POSTS_COUNT)
    : 1;
};

export const getAllTags = async () => {
  const allPosts = await getAllposts();

  if (!allPosts) {
    console.error('some errors were occured.');
    return;
  }

  const dupricated = allPosts.flatMap((post) => post.tags);
  const tags = Array.from(new Set(dupricated));

  return tags;
};
