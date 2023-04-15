import { Post, PostResponse } from "@/domain/models/Post";
import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import camelcaseKeys from "camelcase-keys";

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

export const getAllposts = async () => {
    if (!process.env.NOTION_DATABASE_ID) {
        console.error("ERROR: no database id");
        return;
    }

    const posts = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID,
    });

    return formatPostResponse(posts.results);
}

const formatPostResponse = (posts: PageObjectResponse[]): Post[] => {
  const formatPosts: PostResponse[] = posts.map((_post) => {
    const post = camelcaseKeys(_post, { deep: true });
    return {
      url: post.properties.url,
      title: post.properties.title,
      tags: post.properties.tags,
      slug: post.properties.slug,
      publishDate: post.properties.publishDate,
      lastEditedDate: post.properties.lastEditedDate,
  }
  });

  return formatPosts.map((post): Post => ({
      url: post.url as unknown as string || '',
      title: post.title.title?.[0]?.plainText || '',
      tags: post.tags.multiSelect as string[],
      slug: post.slug.richText?.[0].plainText || '',
      publishDate: post.publishDate.createdTime as unknown as Date,
      lastEditedDate: post.lastEditedDate.lastEditedTime as unknown as Date,
    }))
};
