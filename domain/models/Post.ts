import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type PostResponse = {
    url: PageObjectResponse['properties']['url'];
    title: PageObjectResponse['properties']['title'] & { title?: {
        plainText?: string;
        href?: string | null;
    }[]};
    tags: PageObjectResponse['properties']['multiSelect'] & {
        multiSelect?: any[];
    };
    publishDate: PageObjectResponse['properties']['createdTime'] & {
        createdTime?: string;
    } ;
    lastEditedDate: PageObjectResponse['properties']['lastEditedTime'] & {
        lastEditedTime?: string;
    };
}

export type Post = {
    url: string;
    title: string;
    tags: string[];
    publishDate: Date;
    lastEditedDate: Date;
}
