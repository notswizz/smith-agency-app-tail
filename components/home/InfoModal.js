import React from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const InfoModal = ({ isOpen, onClose }) => {
    const title = "The Smith Agency is...";
    const bulletPoints = [
        { text: "Real Experience in the Fashion Industry", image: "/tsa1.png" },
        { text: "A worry-free solution for Vendors", image: "/tsa2.png" },
        { text: "Empowering Women", image: "/tsa3.png" },
        { text: "Committed to creating unforgettable experiences", image: "/tsa4.png" },
        // Add more bullet points as needed
    ];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                <div className="min-h-screen px-4 text-center flex items-center justify-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                        <div className="inline-block w-full max-w-lg p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                        <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 mb-4">
                        {title}
                        </Dialog.Title>
                        <div className="mt-2">
                        {bulletPoints.map((point, index) => (
                        <div key={index} className="flex items-center my-4">
                        <div className="flex-shrink-0 mr-4">
                        <Image
    src={point.image}
    alt={`Image for ${point.text}`} // Use backticks and ${} for dynamic values
    width={80}
    height={80}
    className="rounded-full"
/>

                        </div>
                        <p className="text-md text-gray-700">{point.text}</p>
                        </div>
                        ))}
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                        <button
                                                         type="button"
                                                         className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-500 border border-transparent rounded-md hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500"
                                                         onClick={onClose}
                                                     >
                        Close
                        </button>
                        <a
                                                         href="https://www.thesmithagency.net"
                                                         target="_blank"
                                                         rel="noopener noreferrer"
                                                         className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-pink-600"
                                                     >
                        Learn more
                        </a>
                        </div>
                        </div>
                        </Transition.Child>
                        </div>
                        </Dialog>
                        </Transition>
                        );
                        };
                        
                        export default InfoModal;