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
      <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px' }}>
       
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {/* Single image with rounded border */}
          <div style={{ textAlign: 'center', border: '5px solid #ccc', borderRadius: '15px', overflow: 'hidden' }}>
            <Image src={`/tsalogoai2.png`} alt={`Gallery Image 1`} width={300} height={300} />
          </div>

          {/* Instagram Embed Block */}
          <div style={{ marginTop: '20px' }}>
            <blockquote className="instagram-media" data-instgrm-permalink="https://www.instagram.com/the_smithagency/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style={{ background: '#FFF', border: '0', borderRadius: '3px', boxShadow: '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)', margin: '1px auto', maxWidth: '450px', minWidth: '375px', padding: '0', width: '99.375%', width: '-webkit-calc(100% - 2px)', width: 'calc(100% - 2px)' }}>
              {/* The rest of the provided Instagram embed code goes here */}
            </blockquote>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
