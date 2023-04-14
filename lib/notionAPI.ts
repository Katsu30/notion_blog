import { Post, PostResponse } from "@/domain/models/Post";
import { Client } from "@notionhq/client";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

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
  const formatPosts: PostResponse[] = posts.map((post) => (
    {
        url: post.properties.url,
        title: post.properties.title,
        tags: post.properties.tags,
        publishDate: post.properties.publish_date,
        lastEditedDate: post.properties.last_edited_date,
    }
  ));

  return formatPosts.map((post): Post => {
    return {
      url: post.url as unknown as string || '',
      title: post.title.title?.[0]?.plain_text || '',
      tags: post.tags.multi_select as string[],
      publishDate: post.publishDate as unknown as Date,
      lastEditedDate: post.lastEditedDate as unknown as Date,
    }
  })
};
