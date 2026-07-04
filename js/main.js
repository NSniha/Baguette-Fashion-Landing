const body = document.body;
const marquee = document.querySelector("[data-marquee]");
const menuBtn = document.querySelector(".menu-btn");
const closeBtn = document.querySelector(".menu-close");
const overlay = document.querySelector("[data-overlay]");
const mobileLinks = document.querySelectorAll(".mobile-menu a");

const track = document.querySelector("[data-slider-track]");
const slides = Array.from(document.querySelectorAll(".hero-card"));
const prevBtn = document.querySelector("[data-prev]");
const nextBtn = document.querySelector("[data-next]");

let currentSlide = 0;
let sliderTimer = null;
let touchStartX = 0;
let touchEndX = 0;

if (marquee) {
  marquee.innerHTML = marquee.innerHTML + marquee.innerHTML + marquee.innerHTML;
}

const openMenu = () => {
  body.classList.add("menu-open");
  menuBtn?.setAttribute("aria-expanded", "true");
};

const closeMenu = () => {
  body.classList.remove("menu-open");
  menuBtn?.setAttribute("aria-expanded", "false");
};

menuBtn?.addEventListener("click", () => {
  if (body.classList.contains("menu-open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

closeBtn?.addEventListener("click", closeMenu);
overlay?.addEventListener("click", closeMenu);

mobileLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const isMobileSlider = () => window.innerWidth <= 680;

const updateSlider = () => {
  if (!track) return;

  if (isMobileSlider()) {
    track.style.transform = `translate3d(-${currentSlide * 100}%, 0, 0)`;
  } else {
    currentSlide = 0;
    track.style.transform = "";
  }
};

const goToSlide = (index) => {
  if (!slides.length) return;

  currentSlide = (index + slides.length) % slides.length;
  updateSlider();
};

const nextSlide = () => {
  goToSlide(currentSlide + 1);
};

const prevSlide = () => {
  goToSlide(currentSlide - 1);
};

const stopAutoSlide = () => {
  if (sliderTimer) {
    clearInterval(sliderTimer);
    sliderTimer = null;
  }
};

const startAutoSlide = () => {
  stopAutoSlide();

  sliderTimer = setInterval(() => {
    if (isMobileSlider()) nextSlide();
  }, 3600);
};

const restartAutoSlide = () => {
  stopAutoSlide();
  startAutoSlide();
};

nextBtn?.addEventListener("click", () => {
  nextSlide();
  restartAutoSlide();
});

prevBtn?.addEventListener("click", () => {
  prevSlide();
  restartAutoSlide();
});

track?.addEventListener("touchstart", (event) => {
  if (!isMobileSlider()) return;

  touchStartX = event.touches[0].clientX;
  stopAutoSlide();
}, { passive: true });

track?.addEventListener("touchmove", (event) => {
  if (!isMobileSlider()) return;

  touchEndX = event.touches[0].clientX;
}, { passive: true });

track?.addEventListener("touchend", () => {
  if (!isMobileSlider()) return;

  const swipeDistance = touchStartX - touchEndX;

  if (Math.abs(swipeDistance) > 45) {
    if (swipeDistance > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
  }

  touchStartX = 0;
  touchEndX = 0;
  restartAutoSlide();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1080) closeMenu();
  updateSlider();
});

updateSlider();
startAutoSlide();