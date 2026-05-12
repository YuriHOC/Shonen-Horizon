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

  if (page.startsWith("noticia-")) {
    return "home";
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

  wallpaperCards.forEach((card) => {
    const shouldShow = card.dataset.wallpaperFormat === format;

    card.hidden = !shouldShow;
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

socialFabButton?.addEventListener("click", () => {
  const isOpen = socialFab?.classList.toggle("is-open") || false;
  socialFabButton.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("click", (event) => {
  if (!socialFab || !socialFabButton) {
    return;
  }

  const clickedInsideSocialMenu = socialFab.contains(event.target);

  if (!clickedInsideSocialMenu) {
    socialFab.classList.remove("is-open");
    socialFabButton.setAttribute("aria-expanded", "false");
  }
});

function updateHeroLogoScroll() {
  if (!heroLogo) {
    return;
  }

  const scrollProgress = Math.min(window.scrollY / 320, 1);
  document.documentElement.style.setProperty("--hero-logo-scroll", scrollProgress.toFixed(3));
}

function updateTopicDividers() {
  topicSections.forEach((section) => {
    const divider = section.querySelector(".topic-divider");

    if (!divider) {
      return;
    }

    const rect = divider.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height"));
    const fadeIn = clamp((viewportHeight - rect.top) / 180, 0, 1);
    const fadeOut = clamp((rect.bottom - headerHeight) / 180, 0, 1);
    const opacity = fadeIn * fadeOut;
    const drift = (1 - opacity) * -8;

    divider.style.setProperty("--divider-opacity", opacity.toFixed(3));
    divider.style.setProperty("--divider-drift", `${drift.toFixed(2)}px`);
    section.classList.remove("is-topic-fixed");
    divider.classList.remove("is-fixed", "is-released");
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function smoothStep(value) {
  return value * value * (3 - (2 * value));
}

function updateRevealCards() {
  revealCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const enterStart = viewportHeight * 0.84;
    const enterEnd = viewportHeight * 0.46;
    const exitStart = -rect.height * 0.68;
    const exitEnd = -rect.height * 1.08;

    const enterProgress = smoothStep(clamp((enterStart - rect.top) / (enterStart - enterEnd), 0, 1));
    const exitProgress = smoothStep(clamp((exitStart - rect.top) / (exitStart - exitEnd), 0, 1));
    const revealProgress = enterProgress * (1 - exitProgress);
    const slideX = enterProgress < 1
      ? -110 + (enterProgress * 110)
      : exitProgress * 110;

    card.style.setProperty("--reveal", revealProgress.toFixed(3));
    card.style.setProperty("--slide-x", `${slideX.toFixed(2)}vw`);
  });
}

// Implementação futura: substituir por roteamento, filtros e download real.
// Área futura: conectar cards a arquivos reais em assets/images.
window.addEventListener("load", setActiveLink);
window.addEventListener("load", () => setWallpaperFormat(wallpaperSection?.dataset.activeFormat || "desktop"));
window.addEventListener("load", updateHeroLogoScroll);
window.addEventListener("load", updateTopicDividers);
window.addEventListener("load", updateRevealCards);
window.addEventListener("scroll", updateHeroLogoScroll, { passive: true });
window.addEventListener("scroll", updateTopicDividers, { passive: true });
window.addEventListener("scroll", updateRevealCards, { passive: true });
window.addEventListener("resize", updateTopicDividers);
window.addEventListener("resize", updateRevealCards);
