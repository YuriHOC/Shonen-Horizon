const navLinks = document.querySelectorAll(".nav-link");

function getCurrentPage() {
  const page = window.location.pathname.split("/").pop() || "index.html";

  if (page === "wallpapers.html") {
    return "wallpapers";
  }

  if (page === "sobre.html") {
    return "sobre";
  }

  return "home";
}

function setActiveLink() {
  const currentPage = getCurrentPage();

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.page === currentPage);
  });
}

// Implementação futura: substituir por roteamento, filtros e download real.
// Área futura: conectar cards a arquivos reais em assets/images.
window.addEventListener("load", setActiveLink);
