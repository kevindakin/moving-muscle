// GLOBAL VARIABLES
const durationFast = 0.5;
const durationBase = 0.8;
const durationSlow = 1.2;
const easeBase = "power3.inOut";

//
// FUNCTION DECLARATIONS
//

function loader() {
  const loaderPrimary = document.querySelector(".loader_block-primary");
  const loaderSecondary = document.querySelector(".loader_block-secondary");
  const split = document.querySelector('[data-load="split"]');
  const fadeLeft = document.querySelectorAll('[data-load="fade-left"]');

  // const headlineSplit = new SplitType(split, {
  //   types: "lines, words",
  //   tagName: "span",
  // });

  // const splitText = split.querySelectorAll(".word");

  let tl = gsap.timeline({
    defaults: {
      duration: durationBase,
      ease: "power3.out",
    },
  });

  tl.to(loaderPrimary, {
    height: "0%",
    borderRadius: "0 0 20% 20%",
    duration: 1,
    ease: easeBase,
  })
    .to(
      loaderSecondary,
      {
        height: "0%",
        borderRadius: "0 0 30% 30%",
        duration: 1,
        ease: easeBase,
      },
      "<0.1"
    )
    .from(
      split,
      {
        y: "3rem",
        opacity: 0,
        stagger: 0.05,
      },
      "<0.7"
    );

  if (fadeLeft.length) {
    tl.to(
      fadeLeft,
      {
        opacity: 1,
        x: "0rem",
        stagger: 0.2,
      },
      "<0.4"
    );
  }
}

function disableScrolling() {
  document.body.classList.add("no-scroll");
  lenis.stop();
}

function enableScrolling() {
  document.body.classList.remove("no-scroll");
  lenis.start();
}

function mobileMenu() {
  const nav = document.querySelector('[data-menu="nav"]');
  const menu = nav.querySelector(".nav_content");
  const links = menu.querySelectorAll(".nav_link-dropdown");
  const button = nav.querySelector('[data-menu="hamburger"]');
  const btnWrap = nav.querySelector(".nav_button-wrap");

  const lineTop = button.children[0];
  const lineMiddle = button.children[1];
  const lineBottom = button.children[2];

  gsap.set(links, { y: "4rem", opacity: 0 });
  gsap.set(btnWrap, { y: "4rem", opacity: 0 });

  let mobileMenuAnim = gsap.timeline({
    paused: true,
    defaults: {
      duration: 0.5,
      ease: "power2.inOut",
    },
  });

  mobileMenuAnim
    .to(lineTop, {
      y: 10,
      rotate: -45,
    })
    .to(
      lineMiddle,
      {
        x: 24,
        opacity: 0,
      },
      "<"
    )
    .fromTo(
      lineBottom,
      {
        y: 0,
        rotate: 0,
        width: "72%",
      },
      {
        y: -10,
        rotate: 45,
        width: "100%",
      },
      "<"
    )
    .to(
      menu,
      {
        opacity: 1,
        duration: 0.2,
      },
      "<"
    )
    .to(
      links,
      {
        y: "0rem",
        opacity: 1,
        stagger: 0.06,
      },
      "<-0.1"
    )
    .to(
      btnWrap,
      {
        y: "0rem",
        opacity: 1,
      },
      "<0.3"
    );

  button.addEventListener("click", () => {
    if (!menu.classList.contains("is-open")) {
      menu.style.display = "flex";
      menu.style.pointerEvents = "auto";
      requestAnimationFrame(() => {
        menu.classList.add("is-open");
        mobileMenuAnim.timeScale(1).play();
        disableScrolling();
      });
    } else {
      menu.classList.remove("is-open");
      menu.style.pointerEvents = "none";
      mobileMenuAnim
        .timeScale(1.4)
        .reverse()
        .eventCallback("onReverseComplete", () => {
          menu.style.display = "none";
        });
      enableScrolling();
    }
  });
}

function navDropdown() {
  const nav = document.querySelector('[data-menu="nav"]');
  const item = nav.querySelector('[data-menu="link"]');

  if (!item) {
    return;
  }

  const link = item.querySelector(".nav_link");
  const menu = item.querySelector('[data-menu="menu"]');
  const arrow = link.querySelector(".nav_dropdown-icon");

  let timeout;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  let menuOpen = gsap.timeline({
    paused: true,
    defaults: {
      duration: durationFast,
      ease: easeBase,
    },
  });

  menuOpen.to(menu, {
    opacity: 1,
    y: "0rem",
  });

  const closeMenu = () => {
    menuOpen.reverse();
    arrow.classList.remove("is-open");
    menu.style.display = "none";
  };

  const openMenu = () => {
    clearTimeout(timeout);
    menu.style.display = "block";
    arrow.classList.add("is-open");
    menuOpen.play();
  };

  if (isTouch) {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      menu.style.display === "block" ? closeMenu() : openMenu();
    });
  } else {
    item.addEventListener("mouseenter", openMenu);
    menu.addEventListener("mouseenter", openMenu);

    item.addEventListener("mouseleave", () => {
      timeout = setTimeout(closeMenu, 50);
    });

    menu.addEventListener("mouseleave", () => {
      timeout = setTimeout(closeMenu, 50);
    });
  }
}

function navScroll() {
  const nav = document.querySelector('[data-menu="nav"]');
  const border = nav.querySelector(".nav_border");
  const hero = document.querySelector('[data-menu="hero"]');

  const navHeight = nav.offsetHeight;

  let scrollAnim = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: `bottom ${navHeight}px`,
      toggleActions: "play none none reverse",
      onEnter: () => nav.classList.add("is-scrolled"),
      onLeaveBack: () => nav.classList.remove("is-scrolled"),
    },
    defaults: {
      duration: durationBase,
      ease: easeBase,
    },
  });

  scrollAnim.to(border, {
    opacity: 1,
  });
}

function resourceModal() {
  const triggers = document.querySelectorAll('[data-modal-open="resource"]');

  if (!triggers.length) {
    return;
  }

  const wrap = document.querySelector('[data-modal="resource"]');
  const modal = wrap.querySelector(".modal_wrap");
  const closeBtns = wrap.querySelectorAll('[data-modal-close="resource"]');

  triggers.forEach((trigger) => {
    let lastFocusedElement;

    // GSAP Animation
    const tl = gsap.timeline({
      paused: true,
      defaults: {
        duration: durationFast,
        ease: easeBase,
      },
      onReverseComplete: () => {
        wrap.style.display = "none";
        gsap.set(modal, { y: "4rem" });

        // Clear form inputs inside modal
        wrap.querySelectorAll(".modal_wrap .form_input").forEach((input) => {
          input.value = "";
        });
      },
    });

    // Set initial states
    gsap.set(wrap, { opacity: 0, display: "none" });
    gsap.set(modal, { y: "4rem" });

    // Animation sequence
    tl.to(wrap, { opacity: 1 }).to(modal, { y: "0rem" }, "<");

    function openModal() {
      lastFocusedElement = document.activeElement;

      wrap.style.display = "flex";
      tl.play();

      // Push event to GTM when modal opens
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "lead_magnet_opened",
      });

      // Accessibility
      wrap.removeAttribute("inert");
      wrap.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      // Add event listeners to modal instead of document
      modal.addEventListener("keydown", trapFocus);
      wrap.addEventListener("keydown", closeOnEscape);

      // Find and focus first focusable element
      setTimeout(() => {
        const focusableElements = Array.from(
          modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter(
          (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
        );

        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }, 50);
    }

    function closeModal() {
      tl.reverse();

      document.activeElement?.blur();

      wrap.setAttribute("aria-hidden", "true");
      wrap.setAttribute("inert", "");
      document.body.style.overflow = "";

      if (lastFocusedElement) {
        setTimeout(() => lastFocusedElement.focus(), 50);
      }

      // Remove listeners from modal instead of document
      modal.removeEventListener("keydown", trapFocus);
      wrap.removeEventListener("keydown", closeOnEscape);
    }

    function trapFocus(e) {
      if (e.key !== "Tab") return;

      const focusableElements = Array.from(
        modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
      );

      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      const isFirstElement = document.activeElement === firstFocusable;
      const isLastElement = document.activeElement === lastFocusable;

      if (e.shiftKey && isFirstElement) {
        e.preventDefault();
        lastFocusable.focus();
      } else if (!e.shiftKey && isLastElement) {
        e.preventDefault();
        firstFocusable.focus();
      }

      if (!modal.contains(document.activeElement)) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }

    function closeOnEscape(e) {
      if (e.key === "Escape" && wrap.style.display === "flex") {
        closeModal();
      }
    }

    // Event Listeners
    trigger.addEventListener("click", openModal);
    closeBtns.forEach((button) => button.addEventListener("click", closeModal));
    wrap.addEventListener("click", (e) => {
      if (e.target === wrap) closeModal();
    });
  });
}

function copyright() {
  const copyrightDate = document.querySelector(
    '[data-element="copyright-date"]'
  );

  if (copyrightDate) {
    const currentYear = new Date().getFullYear();
    copyrightDate.textContent = currentYear;
  }
}

// SCROLL ANIMATIONS

function splitText() {
  const headings = document.querySelectorAll('[data-scroll="split"]');

  if (!headings.length) {
    return;
  }

  headings.forEach((heading) => {
    gsap.set(heading, { opacity: 0, y: "3rem" });

    let fadeUp = gsap.timeline({
      scrollTrigger: {
        trigger: heading,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      defaults: {
        duration: durationBase,
        ease: "power3.out",
      },
    });

    fadeUp.to(heading, {
      opacity: 1,
      y: "0rem",
    });
  });

  // headings.forEach((heading) => {
  //   const headlineSplit = new SplitType(heading, {
  //     types: "lines, words",
  //     tagName: "span",
  //   });

    // const splitText = heading.querySelectorAll(".word");

    // gsap.set(splitText, { y: "110%" });

    // let splitAnim = gsap.timeline({
    //   scrollTrigger: {
    //     trigger: heading,
    //     start: "top 85%",
    //     toggleActions: "play none none reverse",
    //   },
    //   defaults: {
    //     duration: durationBase,
    //     ease: "power3.out",
    //   },
    // });

    // splitAnim.to(splitText, {
    //   y: "0%",
    //   stagger: 0.05,
    // });
  // });
}

function fadeUp() {
  const fadeEls = document.querySelectorAll('[data-scroll="fade-up"]');

  if (!fadeEls.length) {
    return;
  }

  fadeEls.forEach((el) => {
    gsap.set(el, { opacity: 0, y: "3rem" });

    let fadeUp = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      defaults: {
        duration: durationBase,
        ease: "power3.out",
      },
    });

    fadeUp.to(el, {
      opacity: 1,
      y: "0rem",
    });
  });
}

function fadeIn() {
  const fadeItems = document.querySelectorAll('[data-scroll="fade-in"]');

  if (!fadeItems.length) {
    return;
  }

  fadeItems.forEach((fadeItem) => {
    gsap.set(fadeItem, { opacity: 0 });

    let fadeIn = gsap.timeline({
      scrollTrigger: {
        trigger: fadeItem,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      defaults: {
        duration: durationSlow,
        ease: "power3.out",
      },
    });

    fadeIn.to(fadeItem, {
      opacity: 1,
    });
  });
}

function imageReveal() {
  const wrappers = document.querySelectorAll('[data-scroll="image"]');

  if (!wrappers.length) {
    return;
  }

  wrappers.forEach((wrapper) => {
    gsap.set(wrapper, { scale: 1.2, filter: "blur(2px)" });

    const imageAnim = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top bottom",
        toggleActions: "play none none reverse",
      },
      defaults: {
        duration: durationSlow,
        ease: "power3.out",
      },
    });

    imageAnim.to(wrapper, {
      scale: 1,
      filter: "blur(0px)",
    });
  });
}

//
// FUNCTION INITS
//

loader();
navDropdown();
navScroll();
resourceModal();
copyright();
splitText();
fadeUp();
fadeIn();
imageReveal();

// Mobile Only Functions

if (window.matchMedia("(max-width: 991px)").matches) {
  mobileMenu();
}