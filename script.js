document.documentElement.classList.add("js-ready");

const mediaDesktop = window.matchMedia("(min-width: 992px)");

function setupMrittikHeader() {
  const header = document.querySelector("[data-mrittik-header]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const searchModal = document.querySelector("[data-search-modal]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navClose = Array.from(document.querySelectorAll("[data-nav-close]"));
  const searchOpen = Array.from(document.querySelectorAll("[data-search-open]"));
  const searchClose = Array.from(document.querySelectorAll("[data-search-close]"));
  const searchForm = searchModal?.querySelector("form");

  let lastScrollY = window.scrollY;

  if (header) {
    const syncHeader = () => {
      const currentScrollY = window.scrollY;
      const isPastThreshold = currentScrollY > 147;
      const isScrollingUp = currentScrollY < lastScrollY;

      header.classList.toggle("is-fixed", isPastThreshold);
      header.classList.toggle("is-hidden", isPastThreshold && !isScrollingUp);

      lastScrollY = currentScrollY;
    };

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
  }

  const syncBodyLock = () => {
    const isLocked =
      mobileMenu?.classList.contains("is-open") ||
      searchModal?.classList.contains("is-open");
    document.body.classList.toggle("mrittik-ui-lock", Boolean(isLocked));
  };

  const closeMenu = () => {
    mobileMenu?.classList.remove("is-open");
    syncBodyLock();
  };

  const openMenu = () => {
    mobileMenu?.classList.add("is-open");
    syncBodyLock();
  };

  const closeSearch = () => {
    searchModal?.classList.remove("is-open");
    syncBodyLock();
  };

  const openSearch = () => {
    searchModal?.classList.add("is-open");
    syncBodyLock();
    searchModal?.querySelector("input")?.focus();
  };

  navToggle?.addEventListener("click", openMenu);
  navClose.forEach((button) => button.addEventListener("click", closeMenu));
  searchOpen.forEach((button) => button.addEventListener("click", openSearch));
  searchClose.forEach((button) => button.addEventListener("click", closeSearch));

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    closeSearch();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    closeMenu();
    closeSearch();
  });
}

function setupHeroSlider() {
  const slider = document.querySelector("[data-hero-slider]");

  if (!slider || typeof window.Swiper !== "function") {
    return;
  }

  const slides = Array.from(slider.querySelectorAll("[data-hero-slide]"));
  const dotsWrap = slider.querySelector("[data-hero-dots]");
  const prev = slider.querySelector("[data-hero-prev]");
  const next = slider.querySelector("[data-hero-next]");
  const viewport = slider.querySelector("[data-hero-viewport]");
  const sideLeft = slider.querySelector(".mrittik-hero__side--left");
  const sideRight = slider.querySelector(".mrittik-hero__side--right");
  const initialIndex = Math.max(
    0,
    slides.findIndex((slide) => slide.classList.contains("is-active"))
  );

  if (
    !slides.length ||
    !dotsWrap ||
    !prev ||
    !next ||
    !viewport ||
    !sideLeft ||
    !sideRight
  ) {
    return;
  }

  slides.forEach((slide, index) => {
    slide.dataset.heroIndex = String(index);
  });

  function getNeighborIndexes(index) {
    return {
      prev: (index - 1 + slides.length) % slides.length,
      next: (index + 1) % slides.length
    };
  }

  function syncHeroState(swiper) {
    const activeIndex = swiper.realIndex ?? 0;
    const { prev: prevIndex, next: nextIndex } = getNeighborIndexes(activeIndex);
    const leftImage = slides[nextIndex].style.getPropertyValue("--hero-image");
    const rightImage = slides[prevIndex].style.getPropertyValue("--hero-image");

    slider.style.setProperty("--hero-prev-image", leftImage);
    slider.style.setProperty("--hero-next-image", rightImage);

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    swiper.slides.forEach((slide) => {
      const slideIndex = Number(
        slide.getAttribute("data-swiper-slide-index") ?? "-1"
      );
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });
  }

  const swiper = new window.Swiper(viewport, {
    initialSlide: initialIndex,
    loop: slides.length > 1,
    speed: 900,
    grabCursor: true,
    slidesPerView: 1,
    centeredSlides: false,
    spaceBetween: 16,
    allowTouchMove: slides.length > 1,
    simulateTouch: slides.length > 1,
    touchStartPreventDefault: false,
    watchSlidesProgress: true,
    breakpoints: {
      992: {
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 240
      }
    },
    autoplay: slides.length > 1 ? {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    } : false,
    navigation: {
      prevEl: prev,
      nextEl: next
    },
    pagination: {
      el: dotsWrap,
      clickable: true,
      bulletClass: "mrittik-hero__dot",
      bulletActiveClass: "is-active"
    },
    on: {
      init(instance) {
        syncHeroState(instance);
      },
      slideChange(instance) {
        syncHeroState(instance);
      },
      resize(instance) {
        syncHeroState(instance);
      }
    }
  });

  syncHeroState(swiper);
}

function setupScrollReveal() {
  const targets = Array.from(
    document.querySelectorAll("[data-w-id][style*='opacity:0']")
  );

  if (!targets.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  targets.forEach((target) => observer.observe(target));
}

function setupServices() {
  const serviceList = document.querySelector("[data-services-list]");
  const items = Array.from(document.querySelectorAll("[data-service-item]"));

  if (!serviceList || !items.length) {
    return;
  }

  const clearActive = () => {
    items.forEach((item) => {
      item.classList.remove("is-active");
      item.style.setProperty("--service-image-rotate", "0deg");
      item.style.setProperty("--service-arrow-rotate", "0deg");
    });
  };

  const activate = (item) => {
    clearActive();
    item.classList.add("is-active");
  };

  const updateTilt = (item, clientX) => {
    const bounds = item.getBoundingClientRect();
    const x = clientX - bounds.left;
    const ratio = Math.max(-1, Math.min(1, ((x / bounds.width) - 0.5) * 2));
    const imageTilt = ratio * 7;
    const arrowTilt = ratio * 14;

    item.style.setProperty("--service-image-rotate", `${imageTilt.toFixed(2)}deg`);
    item.style.setProperty("--service-arrow-rotate", `${arrowTilt.toFixed(2)}deg`);
  };

  items.forEach((item) => {
    item.addEventListener("pointerenter", (event) => {
      if (mediaDesktop.matches) {
        activate(item);
        updateTilt(item, event.clientX);
      }
    });

    item.addEventListener("pointermove", (event) => {
      if (!mediaDesktop.matches || !item.classList.contains("is-active")) {
        return;
      }

      updateTilt(item, event.clientX);
    });

    item.addEventListener("focusin", () => activate(item));

    item.addEventListener("click", (event) => {
      event.preventDefault();
      if (item.classList.contains("is-active") && !mediaDesktop.matches) {
        item.classList.remove("is-active");
        return;
      }
      activate(item);
    });

    item.addEventListener("pointerleave", () => {
      item.style.setProperty("--service-image-rotate", "0deg");
      item.style.setProperty("--service-arrow-rotate", "0deg");
    });
  });

  serviceList.addEventListener("pointerleave", () => {
    if (mediaDesktop.matches) {
      clearActive();
    }
  });
}

function setupSlider() {
  const slider = document.querySelector("[data-slider]");
  if (!slider) {
    return;
  }

  const mask = slider.querySelector("[data-slider-mask]");
  const slides = Array.from(slider.querySelectorAll(".testimonial-slide"));
  const prev = slider.querySelector("[data-slider-prev]");
  const next = slider.querySelector("[data-slider-next]");
  const nav = slider.querySelector("[data-slider-nav]");

  if (!mask || slides.length <= 1 || !prev || !next || !nav) {
    return;
  }

  let activeIndex = 0;
  let touchStartX = 0;
  let touchDeltaX = 0;
  let autoplayId = 0;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "w-slider-dot";
    dot.setAttribute("aria-label", `Go to testimonial ${index + 1}`);
    dot.addEventListener("click", () => {
      render(index);
      startAutoplay();
    });
    nav.appendChild(dot);
    return dot;
  });

  function getPrevIndex(index) {
    return (index - 1 + slides.length) % slides.length;
  }

  function getNextIndex(index) {
    return (index + 1) % slides.length;
  }

  function stopAutoplay() {
    window.clearInterval(autoplayId);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayId = window.setInterval(() => {
      render(activeIndex + 1);
    }, 5000);
  }

  function render(index) {
    activeIndex = (index + slides.length) % slides.length;
    const prevIndex = getPrevIndex(activeIndex);
    const nextIndex = getNextIndex(activeIndex);

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
      slide.classList.toggle("is-prev", slideIndex === prevIndex);
      slide.classList.toggle("is-next", slideIndex === nextIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("w-active", dotIndex === activeIndex);
    });
  }

  prev.addEventListener("click", () => {
    render(activeIndex - 1);
    startAutoplay();
  });

  next.addEventListener("click", () => {
    render(activeIndex + 1);
    startAutoplay();
  });

  slider.addEventListener("mouseenter", stopAutoplay);
  slider.addEventListener("mouseleave", startAutoplay);

  mask.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
    touchDeltaX = 0;
    stopAutoplay();
  }, { passive: true });

  mask.addEventListener("touchmove", (event) => {
    touchDeltaX = event.changedTouches[0].clientX - touchStartX;
  }, { passive: true });

  mask.addEventListener("touchend", () => {
    if (Math.abs(touchDeltaX) < 40) {
      startAutoplay();
      return;
    }

    render(activeIndex + (touchDeltaX < 0 ? 1 : -1));
    startAutoplay();
  });

  render(0);
  startAutoplay();
}

function setupFaq() {
  const items = Array.from(document.querySelectorAll("[data-faq-item]"));

  items.forEach((item) => {
    const trigger = item.querySelector(".faq-ques-wrap");
    const answer = item.querySelector(".faq-ans-wrap");

    if (!trigger || !answer) {
      return;
    }

    const close = () => {
      item.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      answer.style.maxHeight = "0px";
    };

    const open = () => {
      items.forEach((otherItem) => {
        if (otherItem !== item) {
          const otherTrigger = otherItem.querySelector(".faq-ques-wrap");
          const otherAnswer = otherItem.querySelector(".faq-ans-wrap");
          otherItem.classList.remove("is-open");
          if (otherTrigger) {
            otherTrigger.setAttribute("aria-expanded", "false");
          }
          if (otherAnswer) {
            otherAnswer.style.maxHeight = "0px";
          }
        }
      });

      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    };

    close();

    trigger.addEventListener("click", () => {
      if (item.classList.contains("is-open")) {
        close();
      } else {
        open();
      }
    });
  });
}

setupMrittikHeader();
setupHeroSlider();
setupScrollReveal();
setupServices();
setupSlider();
setupFaq();
