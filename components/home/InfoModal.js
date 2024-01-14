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
                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
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
                <div className="inline-block w-full max-w-4xl p-8 my-8 overflow-hidden text-left align-middle transition-all transform bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 shadow-2xl rounded-2xl">
                  <Dialog.Title as="h3" className="text-4xl font-extrabold leading-6 text-gray-900 mb-8">
                    {title}
                  </Dialog.Title>
                  {bulletPoints.map((point, index) => (
                    <div key={index} className="flex flex-col md:flex-row items-center my-8">
                      <div className="w-full md:w-1/2 p-2">
                        <Image
                          src={point.image}
                          alt={`Image for ${point.text}`}
                          layout="responsive"
                          width={700}
                          height={500}
                          className="rounded-lg"
                        />
                      </div>
                      <p className="mt-4 md:mt-0 md:ml-4 text-lg font-semibold text-gray-800 bg-white bg-opacity-80 px-3 py-1 rounded-lg inline-block shadow-lg">
                        {point.text}
                      </p>
                    </div>
                  ))}
                  <div className="mt-8 flex justify-end space-x-3">
                  <a
                        href="https://www.thesmithagency.net"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex justify-center px-6 py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 shadow-lg transition-all duration-300"
                    >
                        Learn more
                    </a>
                    <button
                        type="button"
                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 shadow-md"
                        onClick={onClose}
                    >
                        Close
                    </button>
                 

                  </div>
                </div>
              </Transition.Child>
            </div>
          </
          Dialog>
</Transition>
);
};

export default InfoModal;