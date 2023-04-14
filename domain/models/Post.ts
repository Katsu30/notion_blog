import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type PostResponse = {
    url: PageObjectResponse['properties']['url'];
    title: PageObjectResponse['properties']['title'] & { title?: {
        plain_text: string;
        href: string | null;
    }[]};
    tags: PageObjectResponse['properties']['multi_select'] & {
        multi_select?: any[];
    };
    publishDate: PageObjectResponse['properties']['created_time'];
    lastEditedDate: PageObjectResponse['properties']['last_edited_time'];
}

export type Post = {
    url: string;
    title: string;
    tags: string[];
    publishDate: Date;
    lastEditedDate: Date;
}
