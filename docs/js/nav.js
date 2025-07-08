document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    btn.classList.toggle("open");
    btn.setAttribute("aria-expanded", isOpen);
  });
});
