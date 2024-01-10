import React, { useEffect } from 'react';
import Header from '../components/nav/Header';
import Image from 'next/image';


const HomePage = () => {
  useEffect(() => {
    // Add any required logic here
  }, []);

  return (
    <>
      <Header />
      <div className="container mx-auto flex justify-center items-center flex-wrap gap-5 p-5">
        <div className="text-block">
          <h1 className="text-3xl font-bold my-4 text-glow">The Smith Agency</h1>
          <p className="text-xl my-2">Premier Boutique Staffing</p> 
        </div>
        <div className="image-block text-center">
          <Image
            src="/tsalogo.png"
            alt="The Smith Agency Logo"
            width={300}
            height={300}
            className="inline-block image-glow"
          />
        </div>
      </div>
    </>
  );
}; 

export default HomePage;
