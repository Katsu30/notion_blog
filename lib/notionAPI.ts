import { Client } from "@notionhq/client";

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

    return posts.results;
}
