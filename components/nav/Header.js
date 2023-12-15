import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-black text-white py-1 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <div className="logo-container">
          {/* TSA logo clickable and redirecting to the homepage */}
          <Link href="/" passHref>
            <Image src="/tsalogo.png" alt="TSA Logo" width={50} height={25} className="cursor-pointer" />
          </Link>
        </div>
        <ul className="flex space-x-4">
          <li className="hover:text-gray-400">
            <Link href="/agents">Agents</Link>
          </li>
          <li className="hover:text-gray-400">
            <Link href="/clients">Clients</Link>
          </li>
          <li className="hover:text-gray-400">
            <Link href="/shows">Shows</Link>
          </li>
          <li className="hover:text-gray-400">
            <Link href="/bookings">Bookings</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
