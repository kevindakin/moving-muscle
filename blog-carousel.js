function blogCarousel() {
  const wrapper = document.querySelector(".blog-carousel_component");

  if (!wrapper) return;

  const slider = wrapper.querySelector(".blog-carousel_cms.swiper");
  const arrowPrev = wrapper.querySelector(".blog-carousel_arrow.swiper-prev");
  const arrowNext = wrapper.querySelector(".blog-carousel_arrow.swiper-next");

  if (!slider || slider.offsetWidth === 0 || slider.offsetHeight === 0) {
    return;
  }

  let swiper = new Swiper(slider, {
    slidesPerView: 1.2,
    spaceBetween: 16,
    speed: 300,
    loop: true,
    loopFillGroupWithBlank: true,
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

blogCarousel();