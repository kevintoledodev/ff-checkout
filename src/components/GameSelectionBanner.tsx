import React from 'react';
import Slider from 'react-slick';
import './checkout-garena-carousel.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function GameSelectionBanner() {
  const banners = [
    { id: 1, src: '/images/banner.png', alt: 'Free Fire' },
    { id: 2, src: '/images/banner_02.png', alt: 'Free Fire 2' },
    { id: 3, src: '/images/banner_03.png', alt: 'Free Fire 3' },
  ];

  const games = [
    { id: 'ff', src: '/images/icon.png', alt: 'Free Fire', name: 'Free Fire', active: true },
    { id: 'delta', src: '/images/icon_c.png', alt: 'Delta Force', name: 'Delta Force', active: false },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    centerMode: false,
    arrows: false, // We'll keep arrows hidden by default (like official) — you can enable
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="game-selection-root">
      {/* Banner (Slick) */}
      <div className="banner">
        <div className="banners">
          <Slider {...settings} className="list-banners">
            {banners.map((b) => (
              <div key={b.id} className="item">
                <img src={b.src} alt={b.alt} />
              </div>
            ))}
          </Slider>

          {/* Left / Right arrows (if you want to show them on hover) */}
          <div className="arrow-banner arrow-left" aria-hidden>
            <svg width="1em" height="1em" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.81438 5.99466L1.68092 0.209207C1.43343 -0.0697356 1.03194 -0.0697356 0.784449 0.209207L0.185654 0.884087C-0.0615759 1.16273 -0.0618396 1.61404 0.184598 1.89328L4.25306 6.49985L0.184862 11.1067C-0.0618401 11.386 -0.0613112 11.8373 0.185919 12.1159L0.784713 12.7908C1.03221 13.0697 1.43369 13.0697 1.68119 12.7908L6.81438 7.00504C7.06187 6.7261 7.06187 6.2736 6.81438 5.99466Z" fill="currentColor"></path></svg>
          </div>
          <div className="arrow-banner arrow-right" aria-hidden>
            <svg width="1em" height="1em" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.81438 5.99466L1.68092 0.209207C1.43343 -0.0697356 1.03194 -0.0697356 0.784449 0.209207L0.185654 0.884087C-0.0615759 1.16273 -0.0618396 1.61404 0.184598 1.89328L4.25306 6.49985L0.184862 11.1067C-0.0618401 11.386 -0.0613112 11.8373 0.185919 12.1159L0.784713 12.7908C1.03221 13.0697 1.43369 13.0697 1.68119 12.7908L6.81438 7.00504C7.06187 6.7261 7.06187 6.2736 6.81438 5.99466Z" fill="currentColor"></path></svg>
          </div>

          <div className="overlay-right overlay-banner" />
          <div className="overlay-left overlay-banner" />
        </div>
      </div>

      {/* Headline / Game Selection */}
      <div className="headline">
        <div className="overlay">
          <div className="overlay-l" />
          <div className="overlay-r" />
        </div>

        <div className="container headline-inner">
          <h3>Seleção de jogos</h3>

          <div className="jogos d-flex align-items-center">
            {games.map((g) => (
              <div key={g.id} className={`jogo ${g.active ? 'active' : 'disabled'}`}>
                {g.active && (
                  <div className="check">
                    <img src="/images/check.svg" alt="Check" />
                  </div>
                )}
                <img src={g.src} alt={g.alt} />
                <span>{g.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
