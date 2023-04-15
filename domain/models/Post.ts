import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type PostResponse = {
    url: PageObjectResponse['properties']['url'];
    title: PageObjectResponse['properties']['title'] & { title?: {
        plain_text: string;
        href: string | null;
    }[]};
    tags: PageObjectResponse['properties']['multiSelect'] & {
        multiSelect?: any[];
    };
    publish_date: PageObjectResponse['properties']['created_time'] & {
        created_time?: string;
    } ;
    last_edited_date: PageObjectResponse['properties']['last_edited_time'] & {
        last_edited_time?: string;
    };
}

export type Post = {
    url: string;
    title: string;
    tags: string[];
    publishDate: Date;
    lastEditedDate: Date;
}
