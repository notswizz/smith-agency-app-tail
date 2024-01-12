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
        <div className="bg-pink-50 min-h-screen flex flex-col items-center justify-center">
          {!session && (
            <div className="w-full max-w-sm mx-auto px-4">
              
              {/* Logo and Title */}
              <div className="text-center mb-8">
                <Image
                  src="/tsawhite.png"
                  alt="The Smith Agency Logo"
                  width={200}
                  height={200}
                  className="inline-block"
                />
                <h1 className="text-2xl font-bold text-gray-800 my-2">THE SMITH AGENCY</h1>
                <p className="text-gray-600">PREMIER STAFFING</p>
              </div>
      
              {/* Portal Sections */}
              <div className="space-y-6 mb-8">
                {/* Sales Rep Portal */}
                <div>
                  <h2 className="text-lg font-semibold text-center mb-2">Sales Rep Portal</h2>
                  <button onClick={() => signIn('sales-rep')} className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-200 focus:ring-opacity-50">
                    Sign In
                  </button>
                </div>
      
                {/* Admin Portal */}
                <div>
                  <h2 className="text-lg font-semibold text-center mb-2">Admin Portal</h2>
                  <button onClick={() => signIn('admin')} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50">
                    Sign In
                  </button>
                </div>
      
                {/* Client Portal */}
                <div>
                  <h2 className="text-lg font-semibold text-center mb-2">Client Portal</h2>
                  <button onClick={() => signIn('client')} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-opacity-50">
                    Sign In
                  </button>
                </div>
              </div>
      
              {/* Header Images */}
              <div className="flex justify-center space-x-2 sm:space-x-4 py-4 overflow-x-auto">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex-none">
                    <Image
                      src={`/tsa${index + 1}.png`}
                      alt={`Header Image ${index + 1}`}
                      width={80}
                      height={90}
                      className="border-2 border-pink-300 rounded-lg"
                    />
                  </div>
                ))}
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
