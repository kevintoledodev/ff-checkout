import { useState } from "react";
import "./slider.css";

export default function Slider() {
  const banners = [
    "images/banner.png",
    "images/banner_02.png",
    "images/banner_03.png",
  ];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="banner">
      <div className="banners">

        <div
          className="list-banners"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {banners.map((src, index) => (
            <div
              className={`item ${index === current ? "active" : ""}`}
              key={index}
            >
              <img src={src} alt={`banner-${index}`} />
            </div>
          ))}
        </div>

        <div className="arrow-banner arrow-left" onClick={prevSlide}>
          <svg width="1em" height="1em" viewBox="0 0 7 13" fill="none">
            <path d="M6.81438 5.99466L1.68092 0.209207C1.43343 -0.0697356 1.03194 -0.0697356 0.784449 0.209207L0.185654 0.884087C-0.0615759 1.16273 -0.0618396 1.61404 0.184598 1.89328L4.25306 6.49985L0.184862 11.1067C-0.0618401 11.386 -0.0613112 11.8373 0.185919 12.1159L0.784713 12.7908C1.03221 13.0697 1.43369 13.0697 1.68119 12.7908L6.81438 7.00504C7.06187 6.7261 7.06187 6.2736 6.81438 5.99466Z" fill="currentColor"/>
          </svg>
        </div>

        <div className="arrow-banner arrow-right" onClick={nextSlide}>
          <svg width="1em" height="1em" viewBox="0 0 7 13" fill="none">
            <path d="M6.81438 5.99466L1.68092 0.209207C1.43343 -0.0697356 1.03194 -0.0697356 0.784449 0.209207L0.185654 0.884087C-0.0615759 1.16273 -0.0618396 1.61404 0.184598 1.89328L4.25306 6.49985L0.184862 11.1067C-0.0618401 11.386 -0.0613112 11.8373 0.185919 12.1159L0.784713 12.7908C1.03221 13.0697 1.43369 13.0697 1.68119 12.7908L6.81438 7.00504C7.06187 6.7261 7.06187 6.2736 6.81438 5.99466Z" fill="currentColor"/>
          </svg>
        </div>

        <div className="overlay-right overlay-banner"></div>
        <div className="overlay-left overlay-banner"></div>

        {/* DOTS */}
        <div className="dots">
          {banners.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === current ? "active" : ""}`}
              onClick={() => setCurrent(index)}
            ></span>
          ))}
        </div>

      </div>
    </div>
  );
}
