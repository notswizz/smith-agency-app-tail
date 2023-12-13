import React, { useEffect } from 'react';
import Image from 'next/image';
import Header from '../components/Header';
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
      <iframe 
    style={{
        background: "#21313C",
        border: "none",
        borderRadius: "2px",
        boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)"
    }}
    width="500"
    height="350"
    src="https://charts.mongodb.com/charts-thesmithagency-powww/embed/charts?id=6579809a-727a-427b-8549-dbf20fa1d7e4&maxDataAge=1800&theme=dark&autoRefresh=true"
/>
<iframe 
    style={{
        background: "#21313C",
        border: "none",
        borderRadius: "2px",
        boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)"
    }}
    width="500"
    height="350"
    src="https://charts.mongodb.com/charts-thesmithagency-powww/embed/charts?id=657983e4-727a-4663-8035-dbf20fac5d10&maxDataAge=3600&theme=dark&autoRefresh=true"
/>

    </>
  );
};

export default HomePage;
