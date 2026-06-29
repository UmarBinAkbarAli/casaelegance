document.documentElement.classList.add("js-ready");

const mediaDesktop = window.matchMedia("(min-width: 992px)");

function scheduleAnimationFrame(callback) {
  let frameId = 0;

  return (...args) => {
    if (frameId) {
      return;
    }

    frameId = requestAnimationFrame(() => {
      frameId = 0;
      callback(...args);
    });
  };
}

function setupMrittikHeader() {
  const header = document.querySelector("[data-mrittik-header]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const searchModal = document.querySelector("[data-search-modal]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navClose = Array.from(document.querySelectorAll("[data-nav-close]"));
  const searchOpen = Array.from(document.querySelectorAll("[data-search-open]"));
  const searchClose = Array.from(document.querySelectorAll("[data-search-close]"));
  const searchForm = searchModal?.querySelector("form");
  const mobileAccordions = Array.from(
    mobileMenu?.querySelectorAll("[data-mobile-accordion]") ?? []
  );

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

    const scheduleHeaderSync = scheduleAnimationFrame(syncHeader);

    syncHeader();
    window.addEventListener("scroll", scheduleHeaderSync, { passive: true });
  }

  const syncBodyLock = () => {
    const isLocked =
      mobileMenu?.classList.contains("is-open") ||
      searchModal?.classList.contains("is-open");
    document.body.classList.toggle("mrittik-ui-lock", Boolean(isLocked));
  };

  const closeMenu = () => {
    mobileMenu?.classList.remove("is-open");
    mobileAccordions.forEach((accordion) => {
      const trigger = accordion.querySelector("[data-mobile-accordion-trigger]");
      accordion.classList.remove("is-open");
      trigger?.setAttribute("aria-expanded", "false");
    });
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

  mobileAccordions.forEach((accordion) => {
    const trigger = accordion.querySelector("[data-mobile-accordion-trigger]");
    const panel = accordion.querySelector("[data-mobile-accordion-panel]");

    if (!trigger || !panel) {
      return;
    }

    const syncPanelHeight = () => {
      accordion.style.setProperty("--mobile-submenu-height", `${panel.scrollHeight}px`);
    };

    syncPanelHeight();

    trigger.addEventListener("click", () => {
      const shouldOpen = !accordion.classList.contains("is-open");
      syncPanelHeight();
      accordion.classList.toggle("is-open", shouldOpen);
      trigger.setAttribute("aria-expanded", String(shouldOpen));
    });

    window.addEventListener("resize", scheduleAnimationFrame(syncPanelHeight));
  });

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

  // Snapshot image values from original slide elements before Swiper touches the DOM.
  // Swiper loop mode clones and repositions slides, which can make getPropertyValue
  // unreliable once the constructor runs. Reading here guarantees the raw inline values.
  const slideImageCache = slides.map((slide) => ({
    image: slide.style.getPropertyValue("--hero-image"),
    fallback: slide.style.getPropertyValue("--hero-image-fallback")
  }));

  function applySideImages(activeIndex) {
    const { prev: prevIndex, next: nextIndex } = getNeighborIndexes(activeIndex);
    const left = slideImageCache[nextIndex];
    const right = slideImageCache[prevIndex];
    slider.style.setProperty("--hero-prev-image-fallback", left.fallback || left.image);
    slider.style.setProperty("--hero-prev-image", left.image);
    slider.style.setProperty("--hero-next-image-fallback", right.fallback || right.image);
    slider.style.setProperty("--hero-next-image", right.image);
  }

  // Apply before Swiper initialises so side panels are filled on the very first frame.
  applySideImages(initialIndex);

  function syncHeroState(swiper) {
    const activeIndex = swiper.realIndex ?? 0;
    applySideImages(activeIndex);

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });

    swiper.slides.forEach((slide, domIndex) => {
      // data-swiper-slide-index is only present in loop mode; without it (loop
      // disabled) fall back to the slide's DOM position so the active slide
      // still receives is-active and its card text is revealed.
      const attr = slide.getAttribute("data-swiper-slide-index");
      const slideIndex = attr !== null ? Number(attr) : domIndex;
      slide.classList.toggle("is-active", slideIndex === activeIndex);
    });
  }

  const swiper = new window.Swiper(viewport, {
    initialSlide: initialIndex,
    // With only 3 slides, Swiper's loop cannot place a peek on both sides of
    // the first slide (the left clone is never generated), leaving the left
    // column empty on load. Centering the middle slide instead guarantees a
    // real neighbour on each side; rewind keeps navigation wrapping at the ends.
    loop: false,
    rewind: slides.length > 1,
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
        spaceBetween: 96
      }
    },
    autoplay: false,
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
        // Re-centre the active slide after a resize so the centered-slide peek
        // transforms are rebuilt against the new viewport width.
        requestAnimationFrame(() => {
          instance.slideTo(instance.activeIndex ?? 0, 0, false);
        });
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

  if (slider.closest(".mrittik-about-clone")) {
    return;
  }
  const viewport = slider.querySelector(".testimonial-mrittik__viewport");
  const prev = slider.querySelector("[data-slider-prev]");
  const next = slider.querySelector("[data-slider-next]");
  const nav = slider.querySelector("[data-slider-nav]");

  if (typeof window.Swiper !== "function" || !viewport || !prev || !next || !nav) {
    return;
  }

  new window.Swiper(viewport, {
    speed: 700,
    loop: true,
    centeredSlides: true,
    slidesPerView: "auto",
    spaceBetween: 26,
    grabCursor: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    navigation: {
      prevEl: prev,
      nextEl: next
    },
    pagination: {
      el: nav,
      clickable: true,
      bulletClass: "w-slider-dot",
      bulletActiveClass: "w-active"
    },
    breakpoints: {
      768: {
        spaceBetween: 34
      },
      992: {
        spaceBetween: 42
      }
    }
  });
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

function setupProjectsFilter() {
  const bars = Array.from(document.querySelectorAll(".projects-filter"));

  if (!bars.length) {
    return;
  }

  bars.forEach((bar) => {
    const buttons = Array.from(bar.querySelectorAll(".projects-filter__btn"));
    const section = bar.closest("section") || document;
    const cards = Array.from(section.querySelectorAll(".work-list .work-item"));

    if (!buttons.length || !cards.length) {
      return;
    }

    const slider = document.createElement("span");
    slider.className = "projects-filter__slider";
    bar.insertBefore(slider, bar.firstChild);

    const moveSlider = (button) => {
      slider.style.width = `${button.offsetWidth}px`;
      slider.style.height = `${button.offsetHeight}px`;
      slider.style.top = `${button.offsetTop}px`;
      slider.style.left = `${button.offsetLeft}px`;
    };

    const activeButton = bar.querySelector(".projects-filter__btn.is-active");
    if (activeButton) {
      slider.style.transition = "none";
      moveSlider(activeButton);
      requestAnimationFrame(() => {
        slider.style.transition = "";
      });
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        moveSlider(button);

        const filter = button.dataset.filter;
        cards.forEach((card) => {
          if (filter === "all" || card.dataset.projectCategory === filter) {
            card.removeAttribute("hidden");
          } else {
            card.setAttribute("hidden", "");
          }
        });
      });
    });

    const syncSliderToActiveButton = scheduleAnimationFrame(() => {
      const active = bar.querySelector(".projects-filter__btn.is-active");
      if (active) {
        moveSlider(active);
      }
    });

    window.addEventListener("resize", syncSliderToActiveButton);
  });
}

function setupAboutClone() {
  const video = document.querySelector("[data-about-video]");
  const videoToggle = document.querySelector("[data-about-video-toggle]");
  const videoFrame = video?.querySelector("iframe");
  const aboutForm = document.querySelector("[data-about-form]");
  const teamRoot = document.querySelector("[data-about-team]");
  const testimonialRoot = document.querySelector("[data-about-testimonials]");

  videoToggle?.addEventListener("click", () => {
    if (!video || !videoFrame) {
      return;
    }

    const videoSrc = videoFrame.dataset.videoSrc;
    if (!videoSrc) {
      return;
    }

    video.classList.add("is-playing");

    if (!videoFrame.src || videoFrame.src === "about:blank") {
      videoFrame.src = videoSrc;
    } else if (!videoFrame.src.includes("autoplay=1")) {
      const separator = videoFrame.src.includes("?") ? "&" : "?";
      videoFrame.src = `${videoFrame.src}${separator}autoplay=1`;
    }
  });

  aboutForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameInput = aboutForm.querySelector("[name='name']");
    const emailInput = aboutForm.querySelector("[name='email']");
    if (!nameInput?.value.trim() || !emailInput?.value.trim()) {
      return;
    }
    const successEl = aboutForm.querySelector("[data-form-success]");
    if (successEl) {
      aboutForm.querySelectorAll(".ce-form__field, .ce-form__row, .ce-form__submit").forEach((el) => {
        el.style.display = "none";
      });
      successEl.style.display = "block";
    }
  });

  if (typeof window.Swiper !== "function") {
    return;
  }

  if (teamRoot) {
    const teamViewport = teamRoot.querySelector(".clone-team-swiper");
    const prev = teamRoot.querySelector("[data-about-team-prev]");
    const next = teamRoot.querySelector("[data-about-team-next]");

    if (teamViewport && prev && next) {
      new window.Swiper(teamViewport, {
        speed: 700,
        slidesPerView: 1.15,
        spaceBetween: 24,
        navigation: {
          prevEl: prev,
          nextEl: next
        },
        breakpoints: {
          768: {
            slidesPerView: 2.2,
            spaceBetween: 28
          },
          992: {
            slidesPerView: 3.15,
            spaceBetween: 32
          }
        }
      });
    }
  }

  if (testimonialRoot) {
    const pagination = document.querySelector("[data-about-testimonials-pagination]");
    const prev = testimonialRoot.closest("[data-slider]")?.querySelector("[data-slider-prev]");
    const next = testimonialRoot.closest("[data-slider]")?.querySelector("[data-slider-next]");

    new window.Swiper(testimonialRoot, {
      speed: 700,
      loop: true,
      centeredSlides: true,
      slidesPerView: "auto",
      spaceBetween: 26,
      grabCursor: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      navigation: prev && next ? {
        prevEl: prev,
        nextEl: next
      } : undefined,
      pagination: pagination ? {
        el: pagination,
        clickable: true,
        bulletClass: "w-slider-dot",
        bulletActiveClass: "w-active"
      } : undefined,
      breakpoints: {
        768: {
          spaceBetween: 34
        },
        992: {
          spaceBetween: 42
        }
      }
    });
  }
}

function calculateRenovationCost({ area, scope, finish }) {
  const scopeBaseRates = {
    Light: 80,
    Standard: 120,
    Turnkey: 160
  };

  const finishMultipliers = {
    Standard: 1,
    Premium: 1.25,
    "Ultra-Premium": 1.55
  };

  const baseRate = scopeBaseRates[scope];
  const finishMultiplier = finishMultipliers[finish];

  if (!baseRate || !finishMultiplier || !Number.isFinite(area) || area <= 0) {
    return 0;
  }

  return area * baseRate * finishMultiplier;
}

function setupCostCalculator() {
  const root = document.querySelector("[data-cost-calculator]");

  if (!root) {
    return;
  }

  const form = root.querySelector("[data-calculator-form]");
  const stepPanels = Array.from(root.querySelectorAll("[data-step-panel]"));
  const resultPanel = root.querySelector("[data-result-panel]");
  const progressSteps = Array.from(root.querySelectorAll("[data-progress-step]"));
  const progressFill = root.querySelector("[data-progress-fill]");
  const nextButton = root.querySelector("[data-step-next]");
  const backButton = root.querySelector("[data-step-back]");
  const stepActions = root.querySelector("[data-step-actions]");
  const editButton = root.querySelector("[data-edit-result]");
  const restartButton = root.querySelector("[data-restart-calculator]");

  if (
    !form ||
    !stepPanels.length ||
    !resultPanel ||
    !progressSteps.length ||
    !progressFill ||
    !nextButton ||
    !backButton ||
    !stepActions
  ) {
    return;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  });

  const state = {
    currentStep: 0,
    propertyType: "Apartment",
    areaUnit: "sqft",
    area: "3000",
    scope: "Light",
    finish: "Standard",
    bathrooms: "2",
    bedrooms: "2",
    leadName: "",
    leadEmail: "",
    leadPhone: "",
    leadVerified: false
  };

  const resultFields = {
    cost: root.querySelector("[data-result-cost]"),
    propertyType: root.querySelector("[data-result-propertyType]"),
    area: root.querySelector("[data-result-area]"),
    scope: root.querySelector("[data-result-scope]"),
    finish: root.querySelector("[data-result-finish]"),
    bathrooms: root.querySelector("[data-result-bathrooms]"),
    bedrooms: root.querySelector("[data-result-bedrooms]")
  };

  const reviewFields = {
    propertyType: root.querySelector("[data-review-propertyType]"),
    area: root.querySelector("[data-review-area]"),
    scope: root.querySelector("[data-review-scope]"),
    finish: root.querySelector("[data-review-finish]"),
    bathrooms: root.querySelector("[data-review-bathrooms]"),
    bedrooms: root.querySelector("[data-review-bedrooms]")
  };

  const areaInput = form.elements.area;
  const areaRange = form.elements.areaRange;
  const areaUnitSelect = form.elements.areaUnit;
  const bathroomsRange = form.elements.bathrooms;
  const bedroomsRange = form.elements.bedrooms;
  const areaValueOutput = root.querySelector('[data-range-value="area"]');
  const bathroomsValueOutput = root.querySelector('[data-range-value="bathrooms"]');
  const bedroomsValueOutput = root.querySelector('[data-range-value="bedrooms"]');
  const rangeInputs = Array.from(root.querySelectorAll(".cost-calculator__range"));

  const getStepError = (stepIndex) =>
    stepPanels[stepIndex]?.querySelector("[data-step-error]");

  const clearStepError = (stepIndex) => {
    const error = getStepError(stepIndex);
    if (error) {
      error.textContent = "";
    }
  };

  const setStepError = (stepIndex, message) => {
    const error = getStepError(stepIndex);
    if (error) {
      error.textContent = message;
    }
  };

  const formatCurrency = (value) => `AED ${formatter.format(value)}`;
  const formatBedrooms = (value) => {
    const count = Number(value);
    return count <= 0 ? "Studio" : String(count);
  };
  const formatAreaLabel = () => `${formatter.format(Number(state.area) || 0)} ${state.areaUnit === "sqm" ? "m2" : "sqft"}`;
  const getAreaInSqft = () => {
    const numericArea = Number(state.area);

    if (!Number.isFinite(numericArea) || numericArea <= 0) {
      return 0;
    }

    return state.areaUnit === "sqm" ? numericArea * 10.7639 : numericArea;
  };
  const updateRangeProgress = (input) => {
    if (!input) {
      return;
    }

    const min = Number(input.min || 0);
    const max = Number(input.max || 100);
    const value = Number(input.value || min);
    const ratio = max > min ? ((value - min) / (max - min)) * 100 : 0;
    input.style.setProperty("--range-progress", `${ratio}%`);
  };
  const syncDetailOutputs = () => {
    if (areaInput) {
      areaInput.value = state.area;
    }

    if (areaRange) {
      areaRange.value = state.area;
      updateRangeProgress(areaRange);
    }

    if (areaUnitSelect) {
      areaUnitSelect.value = state.areaUnit;
    }

    if (bathroomsRange) {
      bathroomsRange.value = state.bathrooms;
      updateRangeProgress(bathroomsRange);
    }

    if (bedroomsRange) {
      bedroomsRange.value = state.bedrooms;
      updateRangeProgress(bedroomsRange);
    }

    if (areaValueOutput) {
      areaValueOutput.textContent = formatAreaLabel();
    }

    if (bathroomsValueOutput) {
      bathroomsValueOutput.textContent = state.bathrooms;
    }

    if (bedroomsValueOutput) {
      bedroomsValueOutput.textContent = formatBedrooms(state.bedrooms);
    }
  };
  const syncReview = () => {
    reviewFields.propertyType.textContent = state.propertyType;
    reviewFields.area.textContent = formatAreaLabel();
    reviewFields.scope.textContent = state.scope;
    reviewFields.finish.textContent = state.finish;
    reviewFields.bathrooms.textContent = state.bathrooms;
    reviewFields.bedrooms.textContent = formatBedrooms(state.bedrooms);
  };

  const updateProgress = () => {
    progressSteps.forEach((step, index) => {
      step.classList.toggle("is-active", index === state.currentStep);
      step.classList.toggle("is-complete", index < state.currentStep);
    });

    const fillPercent =
      stepPanels.length > 1 ? (state.currentStep / (stepPanels.length - 1)) * 100 : 0;
    progressFill.style.width = `${fillPercent}%`;
  };

  const updateStepVisibility = (direction = "forward") => {
    const enterClass = direction === "back" ? "is-entering-back" : "is-entering";

    stepPanels.forEach((panel, index) => {
      const isActive = index === state.currentStep;
      panel.classList.remove("is-active", "is-entering", "is-entering-back");
      panel.hidden = !isActive;
      if (isActive) {
        panel.classList.add("is-active", enterClass);
        panel.addEventListener("animationend", () => {
          panel.classList.remove("is-entering", "is-entering-back");
        }, { once: true });
      }
    });

    resultPanel.hidden = true;
    stepActions.hidden = false;
    backButton.disabled = state.currentStep === 0;
    nextButton.textContent =
      state.currentStep === stepPanels.length - 1 ? "See Estimate" : "Continue";

    if (state.currentStep === stepPanels.length - 1) {
      syncReview();
    }

    updateProgress();
  };

  const showResult = () => {
    const areaInSqft = getAreaInSqft();
    const bathrooms = Number(state.bathrooms);
    const bedrooms = Number(state.bedrooms);
    const estimate = calculateRenovationCost({
      area: areaInSqft,
      scope: state.scope,
      finish: state.finish
    }) + (bathrooms * 3500) + (Math.max(bedrooms, 0) * 5000);

    resultFields.cost.textContent = formatCurrency(estimate);
    resultFields.propertyType.textContent = state.propertyType;
    resultFields.area.textContent = formatAreaLabel();
    resultFields.scope.textContent = state.scope;
    resultFields.finish.textContent = state.finish;
    resultFields.bathrooms.textContent = formatter.format(bathrooms);
    resultFields.bedrooms.textContent = formatBedrooms(state.bedrooms);

    stepPanels.forEach((panel) => {
      panel.hidden = true;
      panel.classList.remove("is-active");
    });

    progressSteps.forEach((step) => {
      step.classList.add("is-complete");
      step.classList.remove("is-active");
    });

    progressFill.style.width = "100%";
    resultPanel.hidden = false;
    resultPanel.classList.add("is-entering");
    resultPanel.addEventListener("animationend", () => resultPanel.classList.remove("is-entering"), { once: true });
    stepActions.hidden = true;
  };

  const leadPanel = root.querySelector("[data-lead-panel]");
  const leadNameInput = root.querySelector("[data-lead-name]");
  const leadEmailInput = root.querySelector("[data-lead-email]");
  const leadPhoneInput = root.querySelector("[data-lead-phone]");
  const leadError = root.querySelector("[data-lead-error]");
  const sendOtpButton = root.querySelector("[data-send-otp]");
  const sendWrap = root.querySelector("[data-lead-send-wrap]");
  const otpWrap = root.querySelector("[data-lead-otp-wrap]");
  const otpInput = root.querySelector("[data-otp-input]");
  const verifyOtpButton = root.querySelector("[data-verify-otp]");
  const resendOtpButton = root.querySelector("[data-resend-otp]");

  const setLeadError = (msg) => {
    if (leadError) leadError.textContent = msg;
  };
  const clearLeadError = () => {
    if (leadError) leadError.textContent = "";
  };

  const showLeadCapture = () => {
    stepPanels.forEach((p) => { p.hidden = true; p.classList.remove("is-active"); });
    progressSteps.forEach((s) => { s.classList.add("is-complete"); s.classList.remove("is-active"); });
    progressFill.style.width = "100%";
    resultPanel.hidden = true;
    stepActions.hidden = true;
    if (leadPanel) {
      leadPanel.hidden = false;
      leadPanel.classList.add("is-entering");
      leadPanel.addEventListener("animationend", () => leadPanel.classList.remove("is-entering"), { once: true });
    }
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateLeadFields = () => {
    const name = (leadNameInput?.value || "").trim();
    const email = (leadEmailInput?.value || "").trim();
    const phone = (leadPhoneInput?.value || "").trim();

    if (!name) { setLeadError("Please enter your first name."); return null; }
    if (!email || !EMAIL_RE.test(email)) { setLeadError("Please enter a valid email address."); return null; }
    if (!phone || phone.length < 7) { setLeadError("Please enter a valid phone number including country code (e.g. +971 5X XXX XXXX)."); return null; }

    clearLeadError();
    return { name, email, phone };
  };

  const setButtonLoading = (btn, loading, loadingText, defaultText) => {
    btn.disabled = loading;
    btn.textContent = loading ? loadingText : defaultText;
  };

  const sendOtp = async () => {
    const fields = validateLeadFields();
    if (!fields) return;

    state.leadName = fields.name;
    state.leadEmail = fields.email;
    state.leadPhone = fields.phone;

    setButtonLoading(sendOtpButton, true, "Sending…", "Send Verification Code");

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fields.phone })
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setLeadError(data.error || "Failed to send the code. Please try again.");
        setButtonLoading(sendOtpButton, false, "", "Send Verification Code");
        return;
      }

      if (sendWrap) sendWrap.hidden = true;
      if (otpWrap) otpWrap.hidden = false;
      if (otpInput) otpInput.focus();
      clearLeadError();
    } catch {
      setLeadError("Network error. Please check your connection and try again.");
      setButtonLoading(sendOtpButton, false, "", "Send Verification Code");
    }
  };

  const verifyOtp = async () => {
    const code = (otpInput?.value || "").trim();
    if (!code || code.length < 4) { setLeadError("Please enter the verification code."); return; }
    clearLeadError();

    setButtonLoading(verifyOtpButton, true, "Verifying…", "Verify & See Estimate");

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: state.leadPhone, code })
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setLeadError(data.error || "Invalid or expired code. Please try again.");
        setButtonLoading(verifyOtpButton, false, "", "Verify & See Estimate");
        return;
      }

      state.leadVerified = true;
      if (leadPanel) leadPanel.hidden = true;
      showResult();
    } catch {
      setLeadError("Network error. Please check your connection and try again.");
      setButtonLoading(verifyOtpButton, false, "", "Verify & See Estimate");
    }
  };

  const resetLeadPanel = () => {
    state.leadName = "";
    state.leadEmail = "";
    state.leadPhone = "";
    state.leadVerified = false;
    if (leadNameInput) leadNameInput.value = "";
    if (leadEmailInput) leadEmailInput.value = "";
    if (leadPhoneInput) leadPhoneInput.value = "";
    if (otpInput) otpInput.value = "";
    if (sendWrap) sendWrap.hidden = false;
    if (otpWrap) otpWrap.hidden = true;
    if (sendOtpButton) { sendOtpButton.disabled = false; sendOtpButton.textContent = "Send Verification Code"; }
    if (verifyOtpButton) { verifyOtpButton.disabled = false; verifyOtpButton.textContent = "Verify & See Estimate"; }
    clearLeadError();
    if (leadPanel) leadPanel.hidden = true;
  };

  sendOtpButton?.addEventListener("click", sendOtp);
  verifyOtpButton?.addEventListener("click", verifyOtp);
  resendOtpButton?.addEventListener("click", () => {
    if (otpWrap) otpWrap.hidden = true;
    if (sendWrap) sendWrap.hidden = false;
    if (sendOtpButton) { sendOtpButton.disabled = false; sendOtpButton.textContent = "Send Verification Code"; }
    if (otpInput) otpInput.value = "";
    clearLeadError();
  });

  const validateStep = (stepIndex) => {
    clearStepError(stepIndex);

    if (stepIndex === 1) {
      const area = Number(state.area);
      const bathrooms = Number(state.bathrooms);
      const bedrooms = Number(state.bedrooms);

      if (!state.area.trim()) {
        setStepError(stepIndex, "Area is required.");
        return false;
      }

      if (!Number.isFinite(area) || area <= 0) {
        setStepError(stepIndex, "Area must be a positive number.");
        return false;
      }

      if (!Number.isFinite(bathrooms) || bathrooms < 0) {
        setStepError(stepIndex, "Bathrooms must be 0 or greater.");
        return false;
      }

      if (!Number.isFinite(bedrooms) || bedrooms < 0) {
        setStepError(stepIndex, "Bedrooms must be 0 or greater.");
        return false;
      }
    }

    return true;
  };

  root.querySelectorAll("[data-option-group]").forEach((group) => {
    const stateKey = group.dataset.optionGroup;
    const buttons = Array.from(group.querySelectorAll("[data-option-value]"));

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const nextValue = button.dataset.optionValue ?? "";
        state[stateKey] = nextValue;

        buttons.forEach((item) => {
          item.classList.toggle("is-selected", item === button);
        });
      });
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  areaInput?.addEventListener("input", (event) => {
    state.area = event.target.value;
    syncDetailOutputs();
    clearStepError(1);
  });

  areaRange?.addEventListener("input", (event) => {
    state.area = event.target.value;
    syncDetailOutputs();
    clearStepError(1);
  });

  areaUnitSelect?.addEventListener("change", (event) => {
    state.areaUnit = event.target.value;
    syncDetailOutputs();
  });

  bathroomsRange?.addEventListener("input", (event) => {
    state.bathrooms = event.target.value;
    syncDetailOutputs();
    clearStepError(1);
  });

  bedroomsRange?.addEventListener("input", (event) => {
    state.bedrooms = event.target.value;
    syncDetailOutputs();
    clearStepError(1);
  });

  nextButton.addEventListener("click", () => {
    if (!validateStep(state.currentStep)) {
      return;
    }

    if (state.currentStep === stepPanels.length - 1) {
      showLeadCapture();
      return;
    }

    state.currentStep += 1;
    updateStepVisibility("forward");
  });

  backButton.addEventListener("click", () => {
    if (state.currentStep === 0) {
      return;
    }

    clearStepError(state.currentStep);
    state.currentStep -= 1;
    updateStepVisibility("back");
  });

  editButton?.addEventListener("click", () => {
    state.currentStep = stepPanels.length - 1;
    updateStepVisibility("back");
  });

  restartButton?.addEventListener("click", () => {
    state.currentStep = 0;
    state.propertyType = "Apartment";
    state.areaUnit = "sqft";
    state.area = "3000";
    state.scope = "Light";
    state.finish = "Standard";
    state.bathrooms = "2";
    state.bedrooms = "2";

    form.reset();

    root.querySelectorAll("[data-option-group]").forEach((group) => {
      const stateKey = group.dataset.optionGroup;
      const buttons = Array.from(group.querySelectorAll("[data-option-value]"));

      buttons.forEach((button, index) => {
        const isSelected = button.dataset.optionValue === state[stateKey];
        button.classList.toggle("is-selected", isSelected || (!state[stateKey] && index === 0));
      });
    });

    stepPanels.forEach((_, index) => clearStepError(index));
    resetLeadPanel();
    syncDetailOutputs();
    updateStepVisibility();
  });

  rangeInputs.forEach((input) => updateRangeProgress(input));
  syncDetailOutputs();
  updateStepVisibility();
}

function setupProcessTimeline() {
  const section = document.querySelector("[data-process-section]");
  if (!section) return;

  const runner = section.querySelector("[data-htimeline-runner]");
  const fill = section.querySelector("[data-htimeline-fill]");
  const stepEls = Array.from(section.querySelectorAll("[data-htimeline-step]"));
  const stepNumEl = section.querySelector("[data-htimeline-step-num]");
  const pipEls = Array.from(section.querySelectorAll("[data-htimeline-pip]"));

  if (!runner) return;

  let sectionOffsetTop = 0;
  let scrollTravel = 0;
  let maxShift = 0;

  function measure() {
    section.style.height = "";
    const runnerW = runner.offsetWidth;
    const overflow = Math.max(0, runnerW - window.innerWidth);
    section.style.height = window.innerHeight + overflow + "px";
    sectionOffsetTop = section.getBoundingClientRect().top + window.scrollY;
    scrollTravel = section.offsetHeight - window.innerHeight;
    maxShift = overflow;
  }

  function onScroll() {
    if (scrollTravel <= 0) return;
    const progress = Math.max(0, Math.min(1, (window.scrollY - sectionOffsetTop) / scrollTravel));

    runner.style.transform = "translateX(" + (-progress * maxShift) + "px)";

    if (fill) fill.style.width = progress * 100 + "%";

    const activeIdx = Math.min(stepEls.length - 1, Math.floor(progress * stepEls.length + 0.12));
    stepEls.forEach(function (el, i) { el.classList.toggle("is-active", i <= activeIdx); });
    pipEls.forEach(function (el, i) { el.classList.toggle("is-active", i <= activeIdx); });
    if (stepNumEl) stepNumEl.textContent = String(activeIdx + 1).padStart(2, "0");
  }

  measure();
  onScroll();

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { measure(); onScroll(); });
  window.addEventListener("load", function () { measure(); onScroll(); });
}

function setupAboutTimeline() {
  const section  = document.querySelector("[data-ab-process-scroll]");
  const pipeline = document.querySelector("[data-ab-pipeline]");
  if (!pipeline || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsap.registerPlugin(ScrollTrigger);

  if (window.innerWidth < 768) return;
  if (!section) return;

  // Slide the pipeline track left as the user scrolls down.
  // end = the pixel overhang of the pipeline beyond the section width.
  gsap.to(pipeline, {
    x: () => -(pipeline.scrollWidth - pipeline.parentElement.offsetWidth),
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => "+=" + (pipeline.scrollWidth - pipeline.parentElement.offsetWidth),
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}

setupMrittikHeader();
setupHeroSlider();
setupScrollReveal();
setupServices();
setupSlider();
setupFaq();
setupProjectsFilter();
setupAboutClone();
setupCostCalculator();
setupProcessTimeline();
setupAboutTimeline();
