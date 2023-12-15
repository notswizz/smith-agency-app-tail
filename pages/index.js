import React, { useEffect } from 'react';
import Header from '../components/nav/Header';
import Router from 'next/router';
import Image from 'next/image';

const HomePage = () => {
  useEffect(() => {
    // Authentication check
    fetch('/api/auth')
      .then(response => {
        if (response.status !== 200) {
          Router.push('/');
        }
      });
  }, []);

  return (
    <>
      <Header />
      <div className="flex justify-center items-center flex-wrap gap-5 p-5">
        <div className="text-center">
          <Image
            src="/tsalogoai2.png" // Assuming the image is in the public directory
            alt="The Smith Agency Logo"
            width={300} // Adjust the size as needed
            height={300} // Adjust the size as needed
            className="inline-block" // Add any additional classes if required
          />
          <h1 className="text-3xl font-bold my-4">The Smith Agency</h1>
        </div>
      </div>
    </>
  );
}; 

export default HomePage;
