import React from 'react';

const Footer = () => {
    return (
        <footer style={{ textAlign: 'center', padding: '20px', marginTop: '20px', backgroundColor: '#f8f8f8', color: '#333' }}>
            <p>&copy; {new Date().getFullYear()} Smith Agency. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
