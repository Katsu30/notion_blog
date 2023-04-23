import Head from 'next/head';
import { GetStaticProps } from 'next';
import { Post } from '@/domain/models/Post';
import { getMaximumPagenationNumber, getMultiplePosts } from '@/lib/notionAPI';
import SinglePost from '@/components/Post/SinglePost';
import { DEFAULT_POSTS_COUNT } from '@/constants';
import { Pagenation } from '@/components/Pagenation/Pagenation';

interface Props {
  allPosts: Post[];
  maxPagenationNumber: number;
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allPosts = (await getMultiplePosts(DEFAULT_POSTS_COUNT)) || [];
  const maxPagenationNumber = await getMaximumPagenationNumber();

  return {
    props: {
      allPosts,
      maxPagenationNumber,
    },
    revalidate: 60 * 60 * 6,
  };
};

const Home = ({ allPosts, maxPagenationNumber }: Props) => {
  return (
    <div className="container w-full h-full mx-auto">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/fabicon.ico" />
      </Head>

      <main className="container w-full mt-16">
        <h1 className="text-5xl font-medium text-center mb-16">Notion Blog</h1>
        {allPosts.map((post) => (
          <SinglePost post={post} key={post.slug} />
        ))}
        <Pagenation numberOfPage={1} maxPageNum={maxPagenationNumber} />
      </main>
    </div>
  );
};

export default Home;
