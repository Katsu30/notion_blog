import Link from 'next/link';
import React from 'react';

export default function Navbar() {
  return (
    <nav className="mx-auto lg:px-2 px-5 lg:w-3/5">
      <div className="container flex items-center justify-between mx-auto">
        <Link
          href="/"
          className="block text-2xl fonr-medium hover:text-sky-900 transition-all duration-300"
        >
          Saudi is a pen
        </Link>
        <div>
          <ul className="flex items-center text-sm">
            <li>
              <Link
                href="/"
                className="block px-4 py-2 hover:text-sky-900 transition-all duration-300"
              >
                Home
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
