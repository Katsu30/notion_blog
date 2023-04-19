import React from "react";
import dayjs from "dayjs";

import { getAllposts, getSinglePost } from "@/lib/notionAPI";
import { Post } from "@/domain/models/Post";

interface Props {
  post: Post;
  markdown: string;
}

interface Params {
  params: {
    slug: string;
  }
}

export const getStaticPaths = async () => {
  const allPosts = await getAllposts();

  if (!allPosts) {
    console.error("cannot fetch blog posts");
    return;
  }
  const paths: Params[] = allPosts.map(({ slug }) => ({ params: {slug} }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }: Params) => {
  console.log("props", params);
  const response = await getSinglePost(params.slug);

  if (!response) {
    console.error("cannot get static props");
    return;
  }

  return {
    props: {
      post: response.page,
      markdown: response.markdown,
    },
    revalidate: 60* 60 * 6,
  };
};

const Post = ({ post, markdown }: Props) => {
  return (
    <>
      <div className="container lg:px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20">
        <h2 className="w-full text-2xl font-medium">{post.title}</h2>
        <div className="border-b-2 w-1/3 mt-1 border-sky-900"></div>
        <span className="text-gray-500">posted date at { dayjs(post.publishDate).format("YYYY-MM-DD") }</span>
        <br />
        {post.tags.map((tag) => {
          return (
            <p className="text-white bg-sky-900 rounded-xl font-medium mt-2 px-2 mx-1 inline-block">{ tag }</p>
          );
        })}
        <div className="mt-10 font-medium">
          { markdown }
        </div>
      </div>
    </>
  );
};

export default Post;
