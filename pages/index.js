import React, { useEffect } from 'react';
import Image from 'next/image';
import Header from '../components/nav/Header';
import Router from 'next/router';

const HomePage = () => {
  useEffect(() => {
    // Authentication check
    fetch('/api/auth')
      .then(response => {
        if (response.status !== 200) {
          Router.push('/');
        }
      });

    // Load Instagram embed script
    const script = document.createElement('script');
    script.async = true;
    script.src = "//www.instagram.com/embed.js";
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '20px', padding: '20px' }}>
        <iframe 
          style={{
            background: "#21313C",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 12px 0 rgba(70, 76, 79, .3)",
            transition: 'transform 0.3s ease-in-out'
          }}
          width="500"
          height="350"
          src="https://charts.mongodb.com/charts-thesmithagency-powww/embed/charts?id=6579809a-727a-427b-8549-dbf20fa1d7e4&maxDataAge=1800&theme=dark&autoRefresh=true"
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        <iframe 
          style={{
            background: "#21313C",
            border: "none",
            borderRadius: "8px",
            boxShadow: "0 4px 12px 0 rgba(70, 76, 79, .3)",
            transition: 'transform 0.3s ease-in-out'
          }}
          width="500"
          height="350"
          src="https://charts.mongodb.com/charts-thesmithagency-powww/embed/charts?id=657983e4-727a-4663-8035-dbf20fac5d10&maxDataAge=3600&theme=dark&autoRefresh=true"
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>
    </>
  );
};

export default HomePage;
