import React, { useEffect, useState } from 'react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Image from 'next/image';
import ApplicationForm from '../components/agent/ApplicationForm';

const HomePage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [showApplicationForm, setShowApplicationForm] = useState(false);

    useEffect(() => {
        if (session) {
            router.push('/agent-portal'); // Redirect to agent-portal if logged in
        }
    }, [session, router]);

    const closeModal = () => setShowApplicationForm(false);

    return (
      <>
          <div className="container mx-auto flex justify-center items-center flex-wrap gap-5 p-5">
              {!session ? (
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                      <div className="image-block text-center">
                          <Image
                              src="/tsawhite.png"
                              alt="The Smith Agency Logo"
                              width={300}
                              height={300}
                              className="inline-block"
                          />
                      </div>
                      <div className="text-block">
                          <button onClick={() => signIn()} className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out shadow-lg">
                              Sales Rep Sign In
                          </button>
                          <button onClick={() => setShowApplicationForm(true)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out shadow-lg mt-4 md:mt-0">
                              Open Application
                          </button>
                      </div>
                  </div>
              ) : (
                  <p className="text-center text-lg font-semibold">Redirecting to Agent Portal...</p>
              )}
  
              {showApplicationForm && (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
                      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full">
                          <ApplicationForm />
                          <button onClick={closeModal} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg mt-4 float-right">
                              Close
                          </button>
                      </div>
                  </div>
              )}
          </div>
      </>
  );
  
}; 

export default HomePage;
