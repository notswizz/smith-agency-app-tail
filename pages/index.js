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
      <div className="flex justify-center items-center flex-wrap gap-5 p-5 landing-container">
        <div>
        <h1 className="text-3xl font-bold my-4 glowing-text">The Smith Agency</h1>
        <p className="text-xl my-2">Premiere Boutique Staffing</p> 
        </div>
        <div className="text-center glowing-content">
          <Image
            src="/tsalogo.png"
            alt="The Smith Agency Logo"
            width={300}
            height={300}
            className="inline-block glowing-image"
          />
        </div>
      </div>
    </>
  );
}; 

export default HomePage;