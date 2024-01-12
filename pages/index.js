import React, { useEffect, useState } from 'react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Image from 'next/image';

const HomePage = () => {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push('/agent-portal'); // Redirect to agent-portal if logged in
        }
    }, [session, router]);

    return (
        <>
          
            <div className="container mx-auto flex justify-center items-center flex-wrap gap-5 p-5">
                {!session ? (
                    <div className="sign-in-container">
                        <div className="text-block">
                        <div className="image-block text-center">
                            <Image
                                src="/tsawhite.png"
                                alt="The Smith Agency Logo"
                                width={300}
                                height={300}
                                className="inline-block image-glow"
                            />
                        </div>
                            <p className="text-xl my-2">Sales Rep Portal</p>
                            <button 
                                onClick={() => signIn()} 
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out mt-4">
                                Sign In
                            </button>
                        </div>
                       
                    </div>
                ) : (
                    // Content for logged-in users, can be adjusted or redirected
                    <p>Redirecting to Agent Portal...</p>
                )}
            </div>
        </>
    );
}; 

export default HomePage;
