export const getPageLink = (pageNum: number, tag?: string) => {
  return tag ? `/posts/tag/${tag}/page/${pageNum}` : `/posts/page/${pageNum}`;
};
