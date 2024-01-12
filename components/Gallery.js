import React, { useState } from 'react';
import Image from 'next/image';

const images = [
  "/tsa1.png",
  "/tsa2.png",
  "/tsa3.png"
];

const RotatingGallery = () => {
    const [current, setCurrent] = useState(0);
    const length = images.length;

    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };

    if (!Array.isArray(images) || images.length <= 0) {
        return null;
    }

    return (
        <div className="relative flex justify-center items-center">
            <button onClick={prevSlide} className="absolute left-0 z-10">
                {/* Insert your preferred icon or text for the previous button here */}
                Prev
            </button>
            <button onClick={nextSlide} className="absolute right-0 z-10">
                {/* Insert your preferred icon or text for the next button here */}
                Next
            </button>
            {images.map((image, index) => {
                return (
                    <div className={index === current ? 'slide active' : 'slide'} key={index}>
                        {index === current && (
                            <Image src={image} alt={`Gallery Image ${index + 1}`} width={300} height={300} />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default RotatingGallery;
