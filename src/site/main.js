const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const siteNav = document.querySelector("[data-site-nav]");
const revealElements = document.querySelectorAll(".reveal");
const yearSlot = document.querySelector("[data-year]");
const navLinks = siteNav?.querySelectorAll("a") ?? [];

const syncHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

if (yearSlot) {
  yearSlot.textContent = String(new Date().getFullYear());
}

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

const setNavState = (isOpen) => {
  if (!(navToggle instanceof HTMLButtonElement) || !(siteNav instanceof HTMLElement)) {
    return;
  }

  navToggle.setAttribute("aria-expanded", String(isOpen));
  siteNav.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
};

if (navToggle instanceof HTMLButtonElement && siteNav instanceof HTMLElement) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setNavState(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setNavState(false);
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) {
      setNavState(false);
    }
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    },
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
