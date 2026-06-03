const navLinks = document.querySelectorAll(".nav-link");
const lightbox = document.querySelector(".image-lightbox");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxTitle = document.querySelector(".lightbox-title");
const lightboxClose = document.querySelector(".lightbox-close");
const wallpaperButtons = document.querySelectorAll(".wallpaper-open-button");
const downloadButtons = document.querySelectorAll(".download-button");
const wallpaperSection = document.querySelector(".wallpapers-section");
const wallpaperFormatTabs = document.querySelectorAll("[data-wallpaper-filter]");
const wallpaperCards = document.querySelectorAll("[data-wallpaper-format]");
const socialFab = document.querySelector(".social-fab");
const socialFabButton = document.querySelector(".social-fab-button");
const navToggle = document.querySelector(".nav-toggle");
const siteHeader = document.querySelector(".site-header");
const heroLogo = document.querySelector(".hero-logo-wrap");
const topicSections = document.querySelectorAll(".topic-section");
const revealCards = document.querySelectorAll(".scroll-reveal-card");
const futureLinks = document.querySelectorAll("[data-future-link]");

function getCurrentPage() {
  const page = window.location.pathname.split("/").pop() || "index.html";

  if (page === "wallpapers.html") {
    return "wallpapers";
  }

  if (page === "sobre.html") {
    return "sobre";
  }

  if (page === "noticias.html") {
    return "noticias";
  }

  if (page.startsWith("noticia-")) {
    return "noticias";
  }

  return "home";
}

function setActiveLink() {
  const currentPage = getCurrentPage();

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.page === currentPage);
  });
}

function openLightbox(button) {
  if (!lightbox || !lightboxImage || !lightboxTitle) {
    return;
  }

  const imageSrc = button.dataset.fullImage;
  const imageTitle = button.dataset.imageTitle || "Wallpaper";

  lightboxImage.src = imageSrc;
  lightboxImage.alt = imageTitle;
  lightboxTitle.textContent = imageTitle;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

wallpaperButtons.forEach((button) => {
  button.addEventListener("click", () => openLightbox(button));
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

function downloadOriginalFile(link) {
  const fileUrl = link.getAttribute("href");
  const fileName = link.getAttribute("download") || fileUrl.split("/").pop();

  fetch(fileUrl)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const temporaryLink = document.createElement("a");

      temporaryLink.href = blobUrl;
      temporaryLink.download = fileName;
      document.body.appendChild(temporaryLink);
      temporaryLink.click();
      temporaryLink.remove();
      URL.revokeObjectURL(blobUrl);
    })
    .catch(() => {
      const fallbackLink = document.createElement("a");

      fallbackLink.href = fileUrl;
      fallbackLink.download = fileName;
      document.body.appendChild(fallbackLink);
      fallbackLink.click();
      fallbackLink.remove();
    });
}

downloadButtons.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    downloadOriginalFile(link);
  });
});

function setWallpaperFormat(format) {
  if (!wallpaperSection) {
    return;
  }

  wallpaperSection.dataset.activeFormat = format;

  wallpaperFormatTabs.forEach((tab) => {
    const isActive = tab.dataset.wallpaperFilter === format;

    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });
}

wallpaperFormatTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setWallpaperFormat(tab.dataset.wallpaperFilter);
  });
});

futureLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
  });
});

navToggle?.addEventListener("click", () => {
  const isOpen = siteHeader.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

socialFabButton?.addEventListener("click", () => {
  const isOpen = socialFab?.classList.toggle("is-open") || false;
  socialFabButton.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  if (navToggle && siteHeader && !siteHeader.contains(event.target)) {
    siteHeader.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (socialFab && socialFabButton && !socialFab.contains(event.target)) {
    socialFab.classList.remove("is-open");
    socialFabButton.setAttribute("aria-expanded", "false");
  }
});

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function smoothStep(value) {
  return value * value * (3 - (2 * value));
}

// Valores cacheados — lidos uma vez e atualizados só no resize
let vpHeight = window.innerHeight;
let hdrHeight = parseFloat(
  getComputedStyle(document.documentElement).getPropertyValue("--header-height")
) || 76;

function updateHeroLogoScroll() {
  if (!heroLogo) return;
  const progress = Math.min(window.scrollY / 320, 1);
  document.documentElement.style.setProperty("--hero-logo-scroll", progress.toFixed(3));
}

function updateTopicDividers() {
  topicSections.forEach((section) => {
    const divider = section.querySelector(".topic-divider");
    if (!divider) return;

    const rect    = divider.getBoundingClientRect();
    const fadeIn  = clamp((vpHeight - rect.top)    / 180, 0, 1);
    const fadeOut = clamp((rect.bottom - hdrHeight) / 180, 0, 1);
    const opacity = fadeIn * fadeOut;

    divider.style.setProperty("--divider-opacity", opacity.toFixed(3));
    divider.style.setProperty("--divider-drift", `${((1 - opacity) * -8).toFixed(2)}px`);
    section.classList.remove("is-topic-fixed");
    divider.classList.remove("is-fixed", "is-released");
  });
}

function updateRevealCards() {
  revealCards.forEach((card) => {
    const rect       = card.getBoundingClientRect();
    const enterStart = vpHeight * 0.84;
    const enterEnd   = vpHeight * 0.46;
    const exitStart  = -rect.height * 0.68;
    const exitEnd    = -rect.height * 1.08;

    const enterProgress  = smoothStep(clamp((enterStart - rect.top) / (enterStart - enterEnd), 0, 1));
    const exitProgress   = smoothStep(clamp((exitStart  - rect.top) / (exitStart  - exitEnd),  0, 1));
    const revealProgress = enterProgress * (1 - exitProgress);
    const dir = (card.classList.contains("tiktok-feature") || card.classList.contains("twitch-feature")) ? 1 : -1;
    const slideX = enterProgress < 1
      ? dir * (110 - enterProgress * 110)
      : -dir * exitProgress * 110;

    card.style.setProperty("--reveal",  revealProgress.toFixed(3));
    card.style.setProperty("--slide-x", `${slideX.toFixed(2)}vw`);
  });
}

// Um único RAF por frame — elimina trabalho duplicado entre eventos de scroll
let scrollTicking = false;

function runScrollUpdates() {
  updateHeroLogoScroll();
  updateTopicDividers();
  updateRevealCards();
  scrollTicking = false;
}

function onScroll() {
  if (!scrollTicking) {
    requestAnimationFrame(runScrollUpdates);
    scrollTicking = true;
  }
}

// Debounce no resize — atualiza cache e recalcula uma vez após o redimensionamento parar
let resizeTimer;

function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    vpHeight  = window.innerHeight;
    hdrHeight = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--header-height")
    ) || 76;
    runScrollUpdates();
  }, 120);
}

window.addEventListener("load", setActiveLink);
window.addEventListener("load", () => setWallpaperFormat(wallpaperSection?.dataset.activeFormat || "desktop"));
window.addEventListener("load", runScrollUpdates);
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onResize);
