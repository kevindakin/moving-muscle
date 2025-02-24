function faqAnchors() {
    const sections = document.querySelectorAll(".faq_spacer");
    const navLinks = document.querySelectorAll(".faq-menu_link");
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let id = entry.target.id;
  
            navLinks.forEach((link) => link.classList.remove("is-active"));
  
            navLinks.forEach((link) => {
              const anchor = link.querySelector("a");
              if (anchor && anchor.getAttribute("href") === `#${id}`) {
                link.classList.add("is-active");
              }
            });
          }
        });
      },
      { rootMargin: "0% 0px -50% 0px", threshold: 0.1 }
    );
  
    sections.forEach((section) => observer.observe(section));
  }
  
  faqAnchors();  