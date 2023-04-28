import React from 'react';
import Link from 'next/link';

import { PAGENATION_COUNT } from '@/constants';
import { getPageLink } from '@/lib/linkHelper';

interface Props {
  numberOfPage?: number;
  maxPageNum?: number;
  toPage?: string;
  tag?: string;
}

export const Pagenation = ({
  numberOfPage = 1,
  maxPageNum = 1,
  tag,
}: Props) => {
  const getPagenationAdditions = () => {
    if (numberOfPage - maxPageNum / 2 > 1) {
      return numberOfPage - Math.floor(PAGENATION_COUNT / 2) + 1;
    }

    return 1;
  };

  return (
    <div className="mb-8 lg:w-1/2 mx-auto rounded-md p-5">
      <ul className="flex items-center justify-center gap-4">
        {[...Array(maxPageNum > PAGENATION_COUNT ? 5 : maxPageNum)].map(
          (_, i) => (
            <li key={i} className="bg-sky-900 rounded-lg w-6 h-8 relative">
              <Link
                href={getPageLink(i + getPagenationAdditions(), tag)}
                className="absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 text-gray-100"
              >
                {i + getPagenationAdditions()}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
};
