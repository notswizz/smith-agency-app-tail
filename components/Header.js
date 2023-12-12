import React from 'react';
import Link from 'next/link';
import Image from 'next/image';


const Header = () => {
  return (
    <header>
      <nav>
        <div className="logo-container">
          {/* Insert the TSA logo here */}
          <Image src="/tsalogo.png" alt="TSA Logo" width={100} height={50} />
        </div>
        <ul className="header-nav">
        <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/agents">Agents</Link>
          </li>
          <li>
            <Link href="/clients">Clients</Link>
          </li>
          <li>
            <Link href="/shows">Shows</Link>
          </li>
          <li>
            <Link href="/bookings">Bookings</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
