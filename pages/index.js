import React, { useState, useEffect } from 'react';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Image from 'next/image';
import ApplicationForm from '../components/agent/ApplicationForm';
import InfoModal from '../components/home/InfoModal';

const HomePage = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (session) {
            router.push('/agent-portal');
        }
    }, [session, router]);

    return (
        <main className="bg-pink-50 min-h-screen flex flex-col items-center justify-center pt-10">
            {!session && (
                <div className="flex flex-col sm:flex-row justify-center items-center w-full max-w-6xl mx-auto px-4">
                    <section className="w-full sm:w-1/2 max-w-sm sm:mr-4">
                    <div className="text-center mb-8">
    <div className="inline-block border-4 border-pink-600 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out p-2"> {/* Added padding */}
        <Image
            src="/tsawhite.png"
            alt="The Smith Agency Logo"
            width={300}
            height={200}
            className="block" // Changed from inline-block to block for better padding effect
            loading="lazy"
        />
    </div>
</div>


                        <div className="space-y-6 mb-8">
    <button
        onClick={() => signIn("sales-rep")}
        className="button-custom sales-rep-btn w-full"
        aria-label="Sign In to Sales Rep Portal"
    >
        Sales Rep Portal
    </button>
    <button
        onClick={() => signIn("client")}
        className="button-custom client-btn w-full"
        aria-label="Sign In to Client Portal"
    >
        Client Portal
    </button>
    <button
        onClick={() => signIn("admin")}
        className="button-custom admin-btn w-full"
        aria-label="Sign In to Admin Portal"
    >
        Admin Portal
    </button>
  
</div>

<InfoModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title="Your Title Here"
                description="Your description here."
                imageUrl="/tsa.png" // Replace with your image path
            />
                        <div className="flex justify-center space-x-2 sm:space-x-4 py-4 overflow-x-auto">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Image
                                    key={index}
                                    src={`/tsa${index + 1}.png`}
                                    alt={`Header Image ${index + 1}`}
                                    width={80}
                                    height={90}
                                    className="border-2 border-pink-300 rounded-lg"
                                    loading="lazy"
                                />
                            ))}
                        </div>
                    </section>
                    <section className="w-full sm:w-1/2 max-w-sm mt-8 sm:mt-0">
                        
                        <ApplicationForm />
                        <button onClick={() => setModalOpen(true)} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
                Show Info
            </button>
                    </section>
                </div>
            )}
            {session && (
                <p className="text-center text-lg font-semibold">Redirecting to Agent Portal...</p>
            )}
        </main>
    );
    
};

export default HomePage;
