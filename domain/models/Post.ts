import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type PostResponse = {
  id: PageObjectResponse["id"];
  url: PageObjectResponse["url"];
  title: PageObjectResponse["properties"]["title"] & {
    title?: {
      plainText?: string;
      href?: string | null;
    }[]
  };
  tags: PageObjectResponse["properties"]["multiSelect"] & {
    multiSelect?: {
      name: string;
      color: string;
    }[];
  };
  slug: PageObjectResponse["properties"]["richText"] & {
    richText?: {
      plainText?: string; 
    }[]
  }
  publishDate: PageObjectResponse["properties"]["createdTime"] & {
    createdTime?: string;
  } ;
  lastEditedDate: PageObjectResponse["properties"]["lastEditedTime"] & {
    lastEditedTime?: string;
  };
}

export type Post = {
  id: string;
  url: string;
  title: string;
  tags: string[];
  slug: string;
  publishDate: Date;
  lastEditedDate: Date;
}
