import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header>
      <nav>
        <div className="logo-container">
          {/* Make the TSA logo clickable and redirect to the homepage */}
          <Link href="/" passHref>
            <Image src="/tsalogo.png" alt="TSA Logo" width={100} height={50} style={{ cursor: 'pointer' }} />
          </Link>
        </div>
        <ul className="header-nav">
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
          <li>
            <Link href="/agent-forms">Agent Forms</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
