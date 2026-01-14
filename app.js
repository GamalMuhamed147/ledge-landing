// Mobile menu toggle
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => {
    const isOpen = !mobileMenu.hasAttribute("hidden");
    if (isOpen) {
      mobileMenu.setAttribute("hidden", "");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "Menu";
    } else {
      mobileMenu.removeAttribute("hidden");
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.textContent = "Close";
    }
  });

  // Close menu after clicking a link
  mobileMenu.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      mobileMenu.setAttribute("hidden", "");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "Menu";
    });
  });
}

// Demo form placeholder
const form = document.getElementById("demoForm");
const out = document.getElementById("formOut");

if (form && out) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();

    out.textContent = `Thanks${name ? ", " + name : ""}. Your request has been captured (placeholder).`;
    form.reset();
  });
}
// ===============================
// Pricing: Expand/Collapse details
// ===============================
(function pricingDetails() {
  const toggles = document.querySelectorAll("[data-toggle]");
  if (!toggles.length) return;

  toggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-toggle");
      const panel = document.getElementById(`details-${key}`);
      if (!panel) return;

      const isOpen = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.hidden = isOpen;

      const text = btn.querySelector(".detailsToggle__text");
      const icon = btn.querySelector(".detailsToggle__icon");
      if (text) text.textContent = isOpen ? "Expand Plan Details" : "Collapse Plan Details";
      if (icon) icon.textContent = isOpen ? "+" : "–"; // keep same visual like your screenshot
    });
  });
})();



