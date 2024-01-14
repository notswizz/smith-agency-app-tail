import React from 'react';

const AnnouncementsHeader = ({ announcements }) => {
    return (
        <div className="overflow-hidden bg-gray-800 py-3 border-b-4 border-pink-500">
            <div className="whitespace-nowrap animate-scroll-left flex items-center">
                {announcements.map((announcement, index) => (
                    <span key={index} className="inline-block mr-8 last:mr-0 text-pink-300 font-semibold text-lg px-4 py-1 bg-gray-700 rounded-full shadow transition-all duration-300 hover:bg-gray-600 hover:text-pink-400">
                        {announcement}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementsHeader;
