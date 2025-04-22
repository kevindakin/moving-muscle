function reviewCarousel() {
    const wrapper = document.querySelector(".reviews-carousel_component");
  
    if (!wrapper) return;
  
    const slider = wrapper.querySelector(".reviews-carousel_swiper.swiper");
    const arrowPrev = wrapper.querySelector(
      ".reviews-carousel_arrow.swiper-prev"
    );
    const arrowNext = wrapper.querySelector(
      ".reviews-carousel_arrow.swiper-next"
    );
  
    if (!slider || slider.offsetWidth === 0 || slider.offsetHeight === 0) {
      return;
    }
  
    let swiper = new Swiper(slider, {
      slidesPerView: 1.2,
      spaceBetween: 12,
      speed: 300,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
      },
      centeredSlides: true,
      watchOverflow: true,
      navigation: {
        nextEl: arrowNext,
        prevEl: arrowPrev,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: "auto",
          spaceBetween: 24,
        },
      },
    });
  }
  
  reviewCarousel();
  