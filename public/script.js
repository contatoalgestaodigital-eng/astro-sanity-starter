const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");

const setMenuState = (open) => {
  if (!menuToggle || !menu) return;
  menuToggle.setAttribute("aria-expanded", String(open));
  menu.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
};

menuToggle?.addEventListener("click", () => {
  setMenuState(menuToggle.getAttribute("aria-expanded") !== "true");
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

window.addEventListener(
  "scroll",
  () => header?.classList.toggle("scrolled", window.scrollY > 18),
  { passive: true },
);

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) setMenuState(false);
});

document.querySelectorAll("[data-tabs]").forEach((component) => {
  const tabs = [...component.querySelectorAll('[role="tab"]')];
  const panels = [...component.querySelectorAll('[role="tabpanel"]')];

  const activate = (tab, moveFocus = false) => {
    const key = tab.dataset.tab;

    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });

    panels.forEach((panel) => {
      const active = panel.dataset.panel === key;
      panel.hidden = !active;
      panel.classList.toggle("active", active);
    });

    if (moveFocus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activate(tab));
    tab.addEventListener("keydown", (event) => {
      const previousKeys = ["ArrowLeft", "ArrowUp"];
      const nextKeys = ["ArrowRight", "ArrowDown"];
      let nextIndex = index;

      if (previousKeys.includes(event.key)) nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (nextKeys.includes(event.key)) nextIndex = (index + 1) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;

      if (nextIndex !== index) {
        event.preventDefault();
        activate(tabs[nextIndex], true);
      }
    });
  });

  const selected = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0];
  if (selected) activate(selected);
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.13, rootMargin: "0px 0px -40px" },
  );

  revealItems.forEach((item) => observer.observe(item));
}

if (reducedMotion) {
  document.querySelectorAll("video[autoplay]").forEach((video) => {
    video.pause();
    video.removeAttribute("autoplay");
  });
}

document.querySelectorAll(".faq-list details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".faq-list details").forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});

const privacyDialog = document.querySelector("[data-privacy-dialog]");
document.querySelectorAll("[data-open-privacy]").forEach((button) => {
  button.addEventListener("click", () => privacyDialog?.showModal());
});

document.querySelectorAll("[data-close-privacy]").forEach((button) => {
  button.addEventListener("click", () => privacyDialog?.close());
});

privacyDialog?.addEventListener("click", (event) => {
  const bounds = privacyDialog.getBoundingClientRect();
  const outside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (outside) privacyDialog.close();
});

document.querySelectorAll("[data-year]").forEach((item) => {
  item.textContent = String(new Date().getFullYear());
});
