// components/AnnouncementsHeader.js
import React from 'react';

// AnnouncementsHeader.js
const AnnouncementsHeader = ({ announcements }) => {
    return (
        <div className="overflow-hidden bg-blue-200 py-2">
            <div className="whitespace-nowrap animate-scroll-left">
                {announcements.map((announcement, index) => (
                    <span key={index} className="inline-block mr-4 last:mr-0">
                        {announcement}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default AnnouncementsHeader;
