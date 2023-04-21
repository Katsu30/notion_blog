import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import camelcaseKeys from 'camelcase-keys';

import { Post, PostResponse } from '@/domain/models/Post';
import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

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
