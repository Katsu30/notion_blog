import React from 'react';
import { GetStaticProps, GetStaticPropsContext, PreviewData } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import { match } from 'ts-pattern';

import {
  getAllposts,
  getMaximumPagenationNumber,
  getPostsByByTagAndPage,
  getPostsByPage,
} from '@/lib/notionAPI';
import { isArray } from '@/lib/util/isArray';
import { Post } from '@/domain/models/Post';
import SinglePost from '@/components/Post/SinglePost';
import { DEFAULT_POSTS_COUNT } from '@/constants';
import { Pagenation } from '@/components/Pagenation/Pagenation';

interface Props {
  posts: Post[];
  pageNumber: number;
  maxPagenationNumber: number;
}

interface Params {
  params: {
    page: string;
    tag: string;
  };
}

export const getStaticPaths = async () => {
  const allPosts = await getAllposts();

  if (!allPosts) {
    console.error('cannot fetch blog posts');
    return;
  }
  const paths: Params[] = [
    ...Array(Math.ceil(allPosts.length / DEFAULT_POSTS_COUNT)),
  ].map((_, i) => {
    return { params: { tag: 'blog', page: (i + 1).toString(10) } };
  });

  return {
    paths,
    fallback: 'blocking',
  };
};

const getPageQueryAsNumber = (pageQuery: string | string[] | undefined) => {
  if (isArray(pageQuery)) return parseInt(pageQuery[0]);

  return match(typeof pageQuery)
    .with('string', () => parseInt(pageQuery as string, 10))
    .with('undefined', () => 1)
    .otherwise(() => 1);
};

const getTagQueryAsString = (tagQuery: string | string[] | undefined) => {
  if (isArray(tagQuery)) return tagQuery[0];

  return match(typeof tagQuery)
    .with('string', () => tagQuery as string)
    .otherwise(() => console.error('getTagQueryAsString went sometiong wrong'));
};

export const getStaticProps: GetStaticProps<Props> = async ({
  params,
}: GetStaticPropsContext<ParsedUrlQuery, PreviewData>) => {
  const pageNumber = getPageQueryAsNumber(params?.page);
  const pageTag = getTagQueryAsString(params?.tag);
  const postsByTag = pageTag
    ? await getPostsByByTagAndPage(pageTag, pageNumber)
    : [];

  const maxPagenationNumber = await getMaximumPagenationNumber();

  return {
    props: {
      posts: postsByTag,
      pageNumber,
      maxPagenationNumber,
    },
    revalidate: 60 * 60 * 6,
  };
};

const Post = ({ posts, pageNumber, maxPagenationNumber }: Props) => {
  return (
    <>
      <div className="container w-full h-full mx-auto">
        <Head>
          <title>Create Next App</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/fabicon.ico" />
        </Head>

        <main className="container w-full mt-16">
          <h1 className="text-5xl font-medium text-center mb-16">
            Notion Blog
          </h1>
          {posts.map((post) => (
            <SinglePost post={post} key={post.slug} />
          ))}
          <Pagenation
            numberOfPage={pageNumber}
            maxPageNum={maxPagenationNumber}
          />
        </main>
      </div>
    </>
  );
};

export default Post;
