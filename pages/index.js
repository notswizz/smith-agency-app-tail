import React, { useEffect } from 'react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Image from 'next/image';
import ApplicationForm from '../components/agent/ApplicationForm';
import RotatingGalleryGallery from '../components/Gallery';
import RotatingGallery from '../components/Gallery';

const HomePage = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push('/agent-portal'); // Redirect to agent-portal if logged in
        }
    }, [session, router]);

  
    return (
        <div className="bg-pink-50 min-h-screen flex flex-col">
          {!session && (
            <div className="container mx-auto px-4">
             
      
              {/* Logo and Title */}
              <div className="text-center mb-6">
                <Image
                  src="/tsawhite.png"
                  alt="The Smith Agency Logo"
                  width={200}
                  height={200}
                  className="inline-block"
                />
               {/* Header Images */}
       <div className="flex justify-center space-x-4 py-4 overflow-x-auto">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex-none">
                    <Image
                      src={`/tsa${index + 1}.png`}
                      alt={`Header Image ${index + 1}`}
                      width={80}
                      height={80}
                      className="border-2 border-pink-300 rounded-full"
                    />
                  </div>
                ))}
              </div>
              </div>
      
             {/* Sign In Buttons */}
<div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
  <button onClick={() => signIn('sales-rep')} className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50">
    Sales Rep Sign In
  </button>
  <button onClick={() => signIn('admin')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50">
    Admin Sign In
  </button>
  <button onClick={() => signIn('client')} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-opacity-50">
    Client Sign In
  </button>
</div>

      
              {/* Application Form */}
              <ApplicationForm />
      
              {/* Rotating Gallery or other content */}
             
            </div>
          )}
      
          {session && (
            <p className="text-center text-lg font-semibold">Redirecting to Agent Portal...</p>
          )}
        </div>
      );
        
      
};

export default HomePage;
