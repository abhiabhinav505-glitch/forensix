const INSTAGRAM_URL = "https://www.instagram.com/forensix_with_ras/";

const SITE_CONFIG = {
  registrationUrl: "https://tinyurl.com/4ffbkp34",
  whatsappUrl: "https://wa.me/918138995561",
  email: "forensixras@gmail.com",
  instagramUrl: INSTAGRAM_URL
};

document.addEventListener("DOMContentLoaded", () => {
  applyConfigLinks();
  initMobileMenu();
  initSmoothScroll();
  initNavbarShadow();
  initScrollReveal();
  initActiveNav();
  initParallax();
  initStageTilt();
});

function applyConfigLinks() {
  document.querySelectorAll("[data-config-link]").forEach((el) => {
    const key = el.getAttribute("data-config-link");
    const value = SITE_CONFIG[key];

    if (key === "email") {
      el.setAttribute("href", "mailto:" + SITE_CONFIG.email);
      return;
    }

    if (key === "instagramUrl") {
      if (!value) {
        el.classList.add("is-disabled");
        el.setAttribute("aria-disabled", "true");
        el.setAttribute("tabindex", "-1");
        el.removeAttribute("href");
        if (el.classList.contains("btn")) {
          el.textContent = "Instagram coming soon";
        }
        el.addEventListener("click", (event) => event.preventDefault());
        return;
      }
      el.setAttribute("href", value);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
      return;
    }

    if (value) {
      el.setAttribute("href", value);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    }
  });
}

function initMobileMenu() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navLinks");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });
}

function closeMobileMenu() {
  document.body.classList.remove("menu-open");
  const toggle = document.getElementById("menuToggle");
  if (toggle) {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      const offset = document.getElementById("navbar")?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset + 1;
      window.scrollTo({ top, behavior: "smooth" });
      closeMobileMenu();
    });
  });
}

function initNavbarShadow() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const update = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 8);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  items.forEach((el, index) => {
    el.style.transitionDelay = Math.min(index % 6, 5) * 80 + "ms";
  });

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

function initParallax() {
  const media = document.querySelector(".hero-bg-img");
  if (!media || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.4) {
      media.style.transform = "translate3d(0," + y * 0.18 + "px,0) scale(1.08)";
    }
  }, { passive: true });
}

function initStageTilt() {
  const stage = document.getElementById("labStage");
  if (!stage || window.matchMedia("(pointer: coarse)").matches) return;

  stage.addEventListener("mousemove", (event) => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.style.transform = "rotateY(" + x * 10 + "deg) rotateX(" + (-y * 8) + "deg)";
  });

  stage.addEventListener("mouseleave", () => {
    stage.style.transform = "rotateY(0) rotateX(0)";
  });
}

function initActiveNav() {
  const sections = ["home", "about", "course", "benefits", "instructor", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const links = Array.from(document.querySelectorAll(".nav-link"));

  const setActive = () => {
    const fromTop = window.scrollY + 120;
    let current = "home";
    sections.forEach((section) => {
      if (section.offsetTop <= fromTop) current = section.id;
    });
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + current);
    });
  };

  setActive();
  window.addEventListener("scroll", setActive, { passive: true });
}
