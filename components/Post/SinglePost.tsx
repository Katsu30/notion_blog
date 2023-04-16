import React from "react";
import Link from "next/link";
import dayjs from "dayjs";

import { Post } from "@/domain/models/Post";

interface Props {
  post: Post;
}

export default function SinglePost({ post }: Props) {
  const { title, publishDate, tags, slug } = post;

  const dateString = dayjs(publishDate).toString();
  return (
    <section className="lg:w-1/2 bg-sky-900 mb-8 mx-auto rounded-md p-5 shadow-2xl hover:shadow-none hover:translate-y-1 transition-all duration-300">
      <div className="flex items-center gap-3">
        <Link href={`/posts/${slug}`}>
          <h2 className="text-gray-100 text-2xl font-medium mb-2">{title}</h2>
        </Link>
        <div className="text-gray-100">{dateString}</div>
        {tags.map((tag) => {
          return <span className="text-white bg-gray-500 rounded-xl px-2 pb-1 font-medium">{tag}</span>;
        })}
      </div>
    </section>
  );
}
