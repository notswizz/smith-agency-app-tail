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
        <main className="min-h-screen flex flex-col items-center justify-center pt-10 bg-main">
            {!session && (
                <div className="flex flex-col sm:flex-row justify-center items-center w-full max-w-6xl mx-auto px-4">
                    <section className="w-full sm:w-1/2 max-w-sm sm:mr-4">
                        <div className="text-center mb-8">
                            <div className="inline-block border-4 border-highlight rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out p-2">
                                <Image
                                    src="/tsa.gif"
                                    alt="The Smith Agency Logo"
                                    width={300}
                                    height={250}
                                    className="block mx-auto shadow-lg"
                                    loading="lazy"
                                    style={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        border: '5px solid #F9C0C2'
                                    }}
                                />
                            </div>
                        </div>
    
                        <div className="space-y-6 mb-8">
                            <button
                                onClick={() => signIn("sales-rep")}
                                className="button-custom sales-rep-btn w-full shadow-lg transition-transform transform hover:-translate-y-1 py-2 px-4 text-lg hover:bg-accent hover:text-primary"
                            >
                                Sales Rep Portal
                            </button>
                            <button
                                onClick={() => router.push('/client-portal')} // Redirect to /client-portal when the button is clicked
                                className="button-custom client-btn w-full shadow-lg transition-transform transform hover:-translate-y-1 py-2 px-4 text-lg hover:bg-main hover:text-accent"
                            >
                                Client Portal
                            </button>
                        </div>
    
                        <InfoModal
                            isOpen={isModalOpen}
                            onClose={() => setModalOpen(false)}
                        />
                        <div className="flex justify-center space-x-2 sm:space-x-4 py-4 overflow-x-auto">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Image
                                    key={index}
                                    src={`/tsa${index + 1}.png`}
                                    alt={`Header Image ${index + 1}`}
                                    width={80}
                                    height={150}
                                    className="border-2 border-pink-300 rounded-lg"
                                    loading="lazy"
                                />
                            ))}
                        </div>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="w-full px-4 py-2 text-accent bg-white border-2 border-accent rounded-full hover:bg-secondary transition-colors duration-200 ease-in-out mb-4 shadow-md"
                        >
                            Who is The Smith Agency?
                        </button>
                    </section>
                    <section className="w-full sm:w-1/2 max-w-sm mt-8 sm:mt-0">
                        <ApplicationForm />
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
