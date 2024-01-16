import React, { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import MyCalendarComponent from '../components/portal/AvailabilityCalendar';
import BookingForm from '../components/booking/BookingForm'; // Import the BookingForm component

const ClientPortal = () => {
    const [showCalendar, setShowCalendar] = useState(true);
    const [showForm, setShowForm] = useState(false); // New state variable to toggle the form
    const handleBookingAdded = (addedBooking) => {
        console.log('New booking added:', addedBooking);
    }

   

    const toggleForm = () => {
        setShowForm(!showForm);
        setShowCalendar(!showCalendar);
    };

    return (
        <>
            <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
                <h1 className="text-4xl font-bold mt-6 text-center" style={{ color: '#344868' }}>
                    THE SMITH AGENCY
                </h1>
                <p className="text-center text-lg mb-8 italic" style={{ color: '#A1BFE4' }}>
                    PREMIER STAFFING
                </p>
                <div className="w-full max-w-full mx-auto p-4 rounded-lg shadow-lg flex flex-col items-center justify-center" style={{ backgroundColor: '#344868' }}>
                    <button 
                        onClick={toggleForm}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {showForm ? 'Show Calendar' : 'Show Form'}
                    </button>
                    <div className="w-full max-w-full md:max-w-full bg-white p-6 rounded-lg shadow-lg mt-4">
                        {showCalendar && (
                            <div className="w-full overflow-hidden">
                                <MyCalendarComponent />
                            </div>
                        )}
                        {showForm && (
                            <div className="w-full overflow-hidden">
                             <BookingForm onBookingAdded={handleBookingAdded} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientPortal;