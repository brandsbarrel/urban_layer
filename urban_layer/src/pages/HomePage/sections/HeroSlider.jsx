import { Link } from "react-router-dom";

import {
  A11y,
  Autoplay,
  Keyboard,
  Navigation,
  Pagination,
} from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from './HeroSlider.module.css';

function HeroSlider({ slides = [] }) {
  return (
    <section className={styles.hero} aria-label="Featured Urban Layers collections">
      <Swiper
        modules={[A11y, Autoplay, Keyboard, Navigation, Pagination]}
        className={styles.swiper}
        slidesPerView={1}
        loop={slides.length > 1}
        speed={700}
        keyboard={{ enabled: true }}
        pagination={{ clickable: true }}
        navigation
        autoplay={{
          delay: 5600,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        onSwiper={(swiper) => {
          swiper.autoplay.start();
        }}
        a11y={{
          prevSlideMessage: 'Previous feature',
          nextSlideMessage: 'Next feature',
          paginationBulletMessage: 'Go to feature {{index}}',
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <article className={styles.slide}>
              <img
                src={slide.image}
                alt={slide.imageAlt}
                className={styles.image}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className={styles.overlay} />
              <div className={styles.content}>
                {slide.eyebrow && <p className={styles.eyebrow}>{slide.eyebrow}</p>}
                <h1 className={styles.title}>{slide.title}</h1>
                {slide.price && (
                  <p className={styles.meta}>
                    Rs.{slide.price.toLocaleString('en-IN')} <span aria-hidden="true">/</span>{' '}
                    {slide.rating} star ({slide.reviewCount} reviews)
                  </p>
                )}
                <p className={styles.description}>{slide.description}</p>
                <div className={styles.actions}>
                  {slide.primaryCta && (
                    <Link to={slide.primaryCta.href} className={styles.primaryButton}>
                      {slide.primaryCta.label}
                    </Link>
                  )}
                  {slide.secondaryCta && (
                    <Link to={slide.secondaryCta.href} className={styles.secondaryButton}>
                      {slide.secondaryCta.label}
                    </Link>
                  )}
                </div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default HeroSlider;
