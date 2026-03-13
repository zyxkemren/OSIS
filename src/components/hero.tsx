"use client";

import { useState } from "react";
import Image from "next/image";
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";
import "./hero.css";

export default function HeroSection({ items, onLearnMore }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState("right");
  const [isAnimating, setIsAnimating] = useState(false);

  const cooldownTime = 800;

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPrevIndex(currentIndex);
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setTimeout(() => setIsAnimating(false), cooldownTime);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setPrevIndex(currentIndex);
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setTimeout(() => setIsAnimating(false), cooldownTime);
  };

  const current = items[currentIndex];

  return (
    <div className="hero-wrapper start">
      <div className="overlay-top" />
      <div className="overlay-bottom" />

      <div className="hero-logo hero-logo-mobile">
        <div className="hero-logo-container">
          <Image src="/img/osisalba.svg" alt="Logo" width={50} height={50} />
          <Image src="/img/osis.svg" alt="Logo" width={35} height={35} />
          <Image src="/img/alba.svg" alt="Logo" width={50} height={50} />
        </div>
        <p className="cibadak school-name-text">SMA PU AL BAYAN CIBADAK</p>
      </div>

      <div className="banner banner-container">
        {items.map((item: any, index: number) => {
          const isActive = index === currentIndex;
          const isPrev = index === prevIndex;

          if (!isActive && !isPrev && prevIndex !== null) return null;

          let zIndexClass = isActive ? "z-20" : "z-10";
          let opacityClass = isActive || isPrev ? "opacity-100" : "opacity-0";

          let animationClass = "";
          if (isActive && prevIndex !== null) {
            animationClass = direction === "right" ? "animate-slide-over-right" : "animate-slide-over-left";
          }

          return (
            <div key={item.id} className={`banner-image-wrapper ${zIndexClass} ${opacityClass} ${animationClass}`}>
              <Image src={item.banner} alt={item.eventName} fill className="object-cover object-center" unoptimized priority={isActive || isPrev} />
            </div>
          );
        })}
      </div>

      <div className="nav-arrows-container">
        <div className="nav-btn" onClick={prevSlide}>
          <BiSolidLeftArrow className="nav-icon" />
        </div>
        <div className="nav-btn" onClick={nextSlide}>
          <BiSolidRightArrow className="nav-icon" />
        </div>
      </div>

      <div className="hero-btm">
        <div className="hero-txt">
          <div className="text-anim-holder">
            {items.map((item: any, index: number) => {
              const isActive = index === currentIndex;
              const isPrev = index === prevIndex;

              if (!isActive && !isPrev) return null;

              let textAnimClass = "";
              if (isActive && prevIndex !== null) {
                textAnimClass = direction === "right" ? "animate-roll-in-from-top" : "animate-roll-in-from-bottom";
              } else if (isPrev) {
                textAnimClass = direction === "right" ? "animate-roll-out-to-bottom" : "animate-roll-out-to-top";
              }

              return (
                <div key={`text-${item.id}`} className={`text-item-container ${textAnimClass}`}>
                  <span className="tagline-text">{item.tagline}</span>
                  <h2 className="event-name event-name-text">{item.eventName}</h2>
                </div>
              );
            })}
          </div>
          <button onClick={() => onLearnMore(current.prokerId)} className="btn-learn">
            Learn More
          </button>
        </div>

        <div className="hero-logo desktop">
          <div className="hero-logo-container">
            <Image src="/img/osisalba.svg" alt="Logo" width={50} height={50} />
            <Image src="/img/osis.svg" alt="Logo" width={35} height={35} />
            <Image src="/img/alba.svg" alt="Logo" width={50} height={50} />
          </div>
          <p className="school-name-text">SMA PU AL BAYAN CIBADAK</p>
        </div>
      </div>
    </div>
  );
}
