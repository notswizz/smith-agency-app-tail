import React from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const InfoModal = ({ isOpen, onClose }) => {
    const title = "The Smith Agency is...";
    const bulletPoints = [
        { text: "Real Experience in the Fashion Industry", image: "/tsa1.png" },
        { text: "A worry-free solution for Vendors", image: "/tsa2.png" },
        { text: "Committed to creating unforgettable experiences", image: "/tsa4.png" },
        // Add more bullet points as needed
    ];

    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto bg-main" onClose={onClose}>
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
              <Dialog.Overlay className="fixed inset-0 bg-secondary bg-opacity-60 backdrop-blur-sm" />
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
              <div className="inline-block w-full max-w-md p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-accent shadow-lg rounded-2xl">
                <Dialog.Title as="h3" className="text-4xl font-extrabold leading-6 text-primary mb-8">
                  {title}
                </Dialog.Title>
                {bulletPoints.map((point, index) => (
                  <div key={index} className="flex flex-col md:flex-row items-center my-8">
                    <div className="w-full md:w-1/2 p-2">
                      <Image
                        src={point.image}
                        alt={`Image for ${point.text}`}
                        layout="responsive"
                        width={500}
                        height={350}
                        className="rounded-lg border-4 border-highlight hover:border-highlight"
                      />
                    </div>
                    <p className="mt-4 md:mt-0 md:ml-4 text-lg font-semibold text-accent bg-white bg-opacity-80 px-3 py-1 rounded-lg inline-block shadow-lg">
                      {point.text}
                    </p>
                  </div>
                ))}
                <div className="relative mt-8">
                  <a
                    href="https://www.thesmithagency.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-0 right-0 inline-flex items-center justify-center px-6 py-3 text-lg font-bold text-white bg-accent rounded-full hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:border-accent shadow-lg transition-all duration-300"
                  >
                    <span>Learn more</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 ml-2">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                  <button
                    type="button"
                    className="absolute bottom-0 left-0 inline-flex justify-center mt-4 p-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500 shadow-md"
                    onClick={onClose}
                  >
                    X
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