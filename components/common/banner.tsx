"use client";

import { useEffect, useState, Suspense } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";

interface BannerSlide {
  id: number;
  heading: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  image: string;
  gradientFrom: string;
  gradientTo: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    heading: "Malas belanja ke mal?",
    subtitle: "Coba Official Store, jaminan pasti ori!",
    ctaText: "Cek Sekarang",
    ctaLink: "/promo",
    image: "/banners/banner-illustration-1.jpg",
    gradientFrom: "#8B5CF6",
    gradientTo: "#A855F7",
  },
  {
    id: 2,
    heading: "Buah Segar Setiap Hari",
    subtitle: "Langsung dari petani, dikirim ke rumahmu!",
    ctaText: "Belanja Sekarang",
    ctaLink: "/kategori/buah-lokal",
    image: "/banners/banner-illustration-1.jpg",
    gradientFrom: "#059669",
    gradientTo: "#34D399",
  },
  {
    id: 3,
    heading: "Gratis Ongkir Se-Indonesia",
    subtitle: "Belanja minimal 50rb, ongkir gratis!",
    ctaText: "Mulai Belanja",
    ctaLink: "/promo/gratis-ongkir",
    image: "/banners/banner-illustration-1.jpg",
    gradientFrom: "#2563EB",
    gradientTo: "#60A5FA",
  },
];

const BannerStatic = () => {
  const slide = bannerSlides[0];

  return (
    <div className="relative w-full min-w-0 max-w-full rounded-xl overflow-hidden banner-swiper">
      <div
        className="relative flex items-center justify-between px-4 py-4 pb-8 sm:px-8 sm:py-7 sm:pb-9 lg:px-12 lg:py-9 lg:pb-10 min-h-[140px] sm:min-h-[190px] lg:min-h-[250px] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${slide.gradientFrom} 0%, ${slide.gradientTo} 100%)`,
        }}
      >
        {/* Left content */}
        <div className="relative z-10 flex-1 max-w-[62%] sm:max-w-[58%] pr-2">
          <h2 className="text-base sm:text-2xl lg:text-3xl font-extrabold text-white mb-1 sm:mb-2 leading-tight tracking-tight">
            {slide.heading}
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-white/90 mb-2.5 sm:mb-4 line-clamp-2 leading-snug">
            {slide.subtitle}
          </p>
          <Link
            href={slide.ctaLink}
            className="inline-block border border-white sm:border-2 text-white text-[11px] sm:text-xs lg:text-sm px-3 py-1 sm:px-5 sm:py-2 rounded-md sm:rounded-lg font-medium hover:bg-white/20 transition-all duration-300 active:scale-95 whitespace-nowrap"
          >
            {slide.ctaText}
          </Link>
        </div>

        {/* Right illustration */}
        <div className="relative z-10 w-[38%] sm:w-[40%] lg:w-[35%] flex items-center justify-end shrink-0">
          <Image
            src={slide.image}
            alt={slide.heading}
            width={350}
            height={300}
            className="w-auto h-auto max-h-[110px] sm:max-h-[170px] lg:max-h-[220px] object-contain drop-shadow-md select-none pointer-events-none"
            priority
          />
        </div>
      </div>

      {/* Bottom bar: pagination + promo link */}
      <div className="absolute bottom-1.5 sm:bottom-2 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-5 pointer-events-none">
        <div className="banner-pagination flex items-center gap-1 sm:gap-1.5 pointer-events-auto">
          <span className="swiper-pagination-bullet swiper-pagination-bullet-active inline-block" />
          <span className="swiper-pagination-bullet inline-block" />
          <span className="swiper-pagination-bullet inline-block" />
        </div>
      </div>
    </div>
  );
};

const BannerSlider = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <BannerStatic />;
  }

  return (
    <div className="relative w-full min-w-0 max-w-full rounded-xl overflow-hidden banner-swiper">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: ".banner-pagination",
        }}
        loop={true}
        className="w-full min-w-0 max-w-full"
      >
        {bannerSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative flex items-center justify-between px-4 py-4 pb-8 sm:px-8 sm:py-7 sm:pb-9 lg:px-12 lg:py-9 lg:pb-10 min-h-[140px] sm:min-h-[190px] lg:min-h-[250px] overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${slide.gradientFrom} 0%, ${slide.gradientTo} 100%)`,
              }}
            >
              {/* Left content */}
              <div className="relative z-10 flex-1 max-w-[62%] sm:max-w-[58%] pr-2">
                <h2 className="text-base sm:text-2xl lg:text-3xl font-extrabold text-white mb-1 sm:mb-2 leading-tight tracking-tight">
                  {slide.heading}
                </h2>
                <p className="text-xs sm:text-sm lg:text-base text-white/90 mb-2.5 sm:mb-4 line-clamp-2 leading-snug">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.ctaLink}
                  className="inline-block border border-white sm:border-2 text-white text-[11px] sm:text-xs lg:text-sm px-3 py-1 sm:px-5 sm:py-2 rounded-md sm:rounded-lg font-medium hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap"
                >
                  {slide.ctaText}
                </Link>
              </div>

              {/* Right illustration */}
              <div className="relative z-10 w-[38%] sm:w-[40%] lg:w-[35%] flex items-center justify-end shrink-0">
                <Image
                  src={slide.image}
                  alt={slide.heading}
                  width={350}
                  height={300}
                  className="w-auto h-auto max-h-[110px] sm:max-h-[170px] lg:max-h-[220px] object-contain drop-shadow-md select-none pointer-events-none"
                  priority={slide.id === 1}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom bar: pagination + promo link */}
      <div className="absolute bottom-1.5 sm:bottom-2 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-5 pointer-events-none">
        {/* Pagination dots */}
        <div className="banner-pagination flex items-center gap-1 sm:gap-1.5 pointer-events-auto" />
      </div>
    </div>
  );
};

const Banner = () => {
  return (
    <Suspense fallback={<BannerStatic />}>
      <BannerSlider />
    </Suspense>
  );
};

export { Banner };