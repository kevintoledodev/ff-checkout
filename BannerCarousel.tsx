// BannerCarousel.tsx


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div className="arrow-banner arrow-left" onClick={onClick}>
      <svg width="1em" height="1em" viewBox="0 0 7 13" fill="none">
        <path d="M6.81438 5.99466L1.68092 0.209207C1.43343 -0.0697356 1.03194 -0.0697356 0.784449 0.209207L0.185654 0.884087C-0.0615759 1.16273 -0.0618396 1.61404 0.184598 1.89328L4.25306 6.49985L0.184862 11.1067C-0.0618401 11.386 -0.0613112 11.8373 0.185919 12.1159L0.784713 12.7908C1.03221 13.0697 1.43369 13.0697 1.68119 12.7908L6.81438 7.00504C7.06187 6.7261 7.06187 6.2736 6.81438 5.99466Z" fill="currentColor"/>
      </svg>
    </div>
  );
};

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <div className="arrow-banner arrow-right" onClick={onClick}>
      <svg width="1em" height="1em" viewBox="0 0 7 13" fill="none">
        <path d="M6.81438 5.99466L1.68092 0.209207C1.43343 -0.0697356 1.03194 -0.0697356 0.784449 0.209207L0.185654 0.884087C-0.0615759 1.16273 -0.0618396 1.61404 0.184598 1.89328L4.25306 6.49985L0.184862 11.1067C-0.0618401 11.386 -0.0613112 11.8373 0.185919 12.1159L0.784713 12.7908C1.03221 13.0697 1.43369 13.0697 1.68119 12.7908L6.81438 7.00504C7.06187 6.7261 7.06187 6.2736 6.81438 5.99466Z" fill="currentColor"/>
      </svg>
    </div>
  );
};

export default function BannerCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3200,
    speed: 500,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <div className="banner">
      <div className="banners">
        <div className="overlay-right overlay-banner" />
        <div className="overlay-left overlay-banner" />

        
          <div className="item">
            <img src="images/banner.png" alt="Banner 1" />
          </div>
          <div className="item">
            <img src="images/banner_02.png" alt="Banner 2" />
          </div>
          <div className="item">
            <img src="images/banner_03.png" alt="Banner 3" />
          </div>
        
      </div>
    </div>
  );
}
