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
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm" />
            </Transition.Child>
    
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate
              -y-0 sm:scale-95"
              >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title as="h3" className="text-3xl font-bold leading-6 text-gray-900 mb-4">
              {title}
              </Dialog.Title>
              <div className="grid gap-4">
              {bulletPoints.map((point, index) => (
              <div key={index} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
              <Image
              src={point.image}
              alt={Image }
              width={100}
              height={100}
              className="rounded-lg"
              />
              </div>
              <p className="flex-1 text-lg font-semibold text-gray-700 bg-blue-100 p-2 rounded-lg shadow">
              {point.text}
              </p>
              </div>
              ))}
              </div>
              <div className="mt-6 flex justify-between items-center">
              <button
                               type="button"
                               className="inline-flex justify-center p-2 text-sm font-medium text-red-600 bg-white rounded-full border border-transparent hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 shadow-sm"
                               onClick={onClose}
                             >
              X
              </button>
              <a
                               href="https://www.thesmithagency.net"
                               target="_blank"
                               rel="noopener noreferrer"
                               className="inline-flex items-center justify-center px-4 py-2 text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 shadow-lg transition-all duration-300"
                             >
              <span>Learn more</span>
              {/* Icon here */}
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