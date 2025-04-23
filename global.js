// GLOBAL VARIABLES
const durationFast = 0.5;
const durationBase = 0.8;
const durationSlow = 1.2;
const easeBase = "power3.inOut";

//
// FUNCTION DECLARATIONS
//

function disableScrolling() {
  document.body.classList.add("no-scroll");
}

function enableScrolling() {
  document.body.classList.remove("no-scroll");
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
  const items = nav.querySelectorAll('[data-menu="link"]');
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  items.forEach((item) => {
    const link = item.querySelector(".nav_link");
    const menu = item.querySelector('[data-menu="menu"]');
    const arrow = link.querySelector(".nav_dropdown-icon");

    if (!link || !menu || !arrow) return;

    let timeout;

    const menuOpen = gsap.timeline({
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
  });
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

function dropdownLinkHover() {
  const links = document.querySelectorAll(".dropdown_link");

  if (!links.length) return;

  links.forEach((link) => {
    const arrow = link.querySelector(".dropdown_arrow");
    const text = link.querySelector(".dropdown_text");

    let tl;

    link.addEventListener("mouseenter", () => {
      if (!tl) {
        tl = gsap.timeline({
          defaults: { duration: 0.3, ease: "power2.inOut" },
          paused: true,
        });

        tl.to(arrow, { x: "0rem", opacity: 1 }).to(text, { x: "0.5rem" }, "<");
      }

      tl.play();
    });

    link.addEventListener("mouseleave", () => {
      if (tl) tl.reverse();
    });
  });
}

function footerLinkHover() {
  const links = document.querySelectorAll(".footer_link");

  if (!links.length) return;

  links.forEach((link) => {
    const texts = link.querySelectorAll(".footer_link-text");

    let tl;

    link.addEventListener("mouseenter", () => {
      if (!tl) {
        if (!texts.length) return;

        tl = gsap.timeline({
          defaults: { duration: 0.25, ease: "power2.inOut" },
          paused: true,
        });

        tl.to(texts, { y: "-100%" });
      }

      tl.play();
    });

    link.addEventListener("mouseleave", () => {
      if (tl) tl.reverse();
    });
  });
}

function linkItemHover() {
  const links = document.querySelectorAll(".icon-list_component.is-link");

  if (!links.length) return;

  links.forEach((link) => {
    const icons = link.querySelectorAll(".link-item_icon");
    const text = link.querySelector(".u-text");

    let tl;

    link.addEventListener("mouseenter", () => {
      if (!tl) {
        if (!icons.length || !text) return;

        tl = gsap.timeline({
          defaults: { duration: 0.25, ease: "power2.inOut" },
          paused: true,
        });

        tl.to(icons, { x: "1.5rem" }).to(text, { x: "1rem" }, "<");
      }

      tl.play();
    });

    link.addEventListener("mouseleave", () => {
      if (tl) tl.reverse();
    });
  });
}

function textLinkHover() {
  const links = document.querySelectorAll(".text-link_component");

  if (!links.length) return;

  links.forEach((link) => {
    const line = link.querySelector(".text-link_line");

    let tl;
    link.addEventListener("mouseenter", () => {
      if (!tl) {
        if (!line) return;

        tl = gsap.timeline({
          defaults: { duration: 0.35, ease: "power2.inOut" },
          paused: true,
        });

        tl.to(line, { width: "100%" });
      }

      tl.play();
    });

    link.addEventListener("mouseleave", () => {
      if (tl) tl.reverse();
    });
  });
}

function blogCardHover() {
  const links = document.querySelectorAll(".blog-card_component");

  if (!links.length) return;

  links.forEach((link) => {
    const image = link.querySelector(".u-cover-absolute");

    let tl;

    link.addEventListener("mouseenter", () => {
      if (!tl) {
        if (!image) return;

        tl = gsap.timeline({
          defaults: { duration: 0.3, ease: "power2.inOut" },
          paused: true,
        });

        tl.to(image, { scale: 1.06 });
      }

      tl.play();
    });

    link.addEventListener("mouseleave", () => {
      if (tl) tl.reverse();
    });
  });
}

//
// FUNCTION INITS
//

navDropdown();
navScroll();
resourceModal();
copyright();

if (window.matchMedia("(min-width: 992px").matches) {
  dropdownLinkHover();
  footerLinkHover();
  linkItemHover();
  textLinkHover();
  blogCardHover();
}

// Mobile Only Functions

if (window.matchMedia("(max-width: 991px)").matches) {
  mobileMenu();
}