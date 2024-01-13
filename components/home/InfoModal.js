import React from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const InfoModal = ({ isOpen, onClose }) => {
    const title = "The Smith Agency is...";
    const bulletPoints = [
        { text: "A leading provider of entertainment services", image: "/tsa1.png" },
        { text: "Known for exceptional customer service", image: "/tsa2.png" },
        { text: "Committed to creating unforgettable experiences", image: "/tsa3.png" },
        // Add more bullet points as needed
    ];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
                <div className="min-h-screen px-4 text-center">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                    </Transition.Child>

                    <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                {title}
                            </Dialog.Title>
                            <div className="mt-2 space-y-4">
                                {bulletPoints.map((point, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <Image
                                            src={point.image}
                                            alt={`Image ${index + 1} in modal`}
                                            width={100}
                                            height={100}
                                            className="rounded-full border-2 border-blue-500"
                                        />
                                        <span className="text-sm text-white bg-blue-500 px-2 py-1 rounded-full">{point.text}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4">
                                <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                                    onClick={onClose}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default InfoModal;