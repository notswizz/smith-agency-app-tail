import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const withPasswordProtection = (WrappedComponent, correctPassword) => {
    return () => {
        const [password, setPassword] = useState('');
        const [isAuthenticated, setIsAuthenticated] = useState(false);

        useEffect(() => {
            const authCookie = Cookies.get('auth');
            if (authCookie === correctPassword) {
                setIsAuthenticated(true);
            }
        }, []);

        const handlePasswordSubmit = (e) => {
            e.preventDefault();

            if (password === correctPassword) {
                setIsAuthenticated(true);
                Cookies.set('auth', password, { expires: 7 });
            } else {
                alert('Incorrect password');
            }
        };

        if (!isAuthenticated) {
            return (
                <form onSubmit={handlePasswordSubmit} className="flex flex-col items-center justify-center h-screen">
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Enter password"
                        className="text-lg px-3 py-2 border-2 border-gray-300 mb-4 focus:outline-none focus:border-blue-500"
                    />
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Submit
                    </button>
                </form>
            );
        }

        return <WrappedComponent />;
    };
};

export default withPasswordProtection;