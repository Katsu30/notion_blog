import React from "react";
import { getSinglePost } from "@/lib/notionAPI";
import { Post } from "@/domain/models/Post";

interface Props {
  params: Post;
}

export const getStaticProps = async ({ params }: Props) => {
  const post = await getSinglePost(params.slug);

  return {
    props: {
      post,
    },
    revalidate: 60* 60 * 6,
  };
};

const Post = ({ params }: Props) => {
  return (
    <div className="container lg:px-2 px-5 h-screen lg:w-2/5 mx-auto mt-20">
      <h2 className="w-full text-2xl font-medium">三回目の投稿です</h2>
      <div className="border-b-2 w-1/3 mt-1 border-sky-900"></div>
      <span className="text-gray-500">日付</span>
      <br />
      <p className="text-white bg-sky-900 rounded-xl font-medium mt-2 px-2 inline-block">Next.js</p>
    </div>
  );
};

export default Post;