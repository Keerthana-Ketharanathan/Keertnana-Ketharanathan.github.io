/* ============================================================
   PORTFOLIO SCRIPT — Keerthana Ketharanathan
   Handles: mobile menu, sticky navbar, active link highlighting,
   scroll reveal, typing effect, counters, back-to-top,
   placeholder links and contact form validation.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Element references ---------- */
  const navbar = document.getElementById("navbar");
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const backToTop = document.getElementById("backToTop");
  const toast = document.getElementById("toast");

  /* ---------- 1. Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- 2. Mobile navigation menu ---------- */
  function closeMenu() {
    navMenu.classList.remove("open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    document.body.style.overflow = isOpen ? "hidden" : ""; // stop background scrolling
  });

  // Close the menu when a link is clicked or Escape is pressed
  navLinks.forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("open")) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* ---------- 3. Navbar style, active link & back-to-top on scroll ---------- */
  function onScroll() {
    const y = window.scrollY;

    // Add background to navbar after scrolling a little
    navbar.classList.toggle("scrolled", y > 20);

    // Show back-to-top button after scrolling down
    backToTop.classList.toggle("show", y > 500);

    // Highlight the nav link of the section currently in view
    let current = "home";
    sections.forEach((section) => {
      if (y >= section.offsetTop - window.innerHeight * 0.35) {
        current = section.id;
      }
    });
    // When at the very bottom, highlight the last section (Contact)
    if (window.innerHeight + y >= document.body.scrollHeight - 4) {
      current = sections[sections.length - 1].id;
    }
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${current}`;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- 4. Scroll reveal animations ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // animate only once
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    // Small stagger so cards in the same row appear one after another
    revealEls.forEach((el) => {
      const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
      const index = siblings.indexOf(el);
      el.style.transitionDelay = `${Math.min(index, 6) * 80}ms`;
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- 5. Typing effect in the hero ---------- */
  const typedEl = document.getElementById("typedRole");
  const roles = [
    "Data Analyst",
    "Power BI Developer",
    "SQL & Python Analyst",
    "Machine Learning Enthusiast",
  ];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;

    function typeLoop() {
      const word = roles[roleIndex];
      typedEl.textContent = word.slice(0, charIndex);

      if (deleting) {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
          return setTimeout(typeLoop, 300);
        }
        return setTimeout(typeLoop, 45);
      }

      charIndex++;
      if (charIndex > roles[roleIndex].length) {
        deleting = true;
        charIndex = roles[roleIndex].length;
        return setTimeout(typeLoop, 1800); // pause on full word
      }
      return setTimeout(typeLoop, 85);
    }
    setTimeout(typeLoop, 2200);
  }

  /* ---------- 6. Animated stat counters ---------- */
  const counters = document.querySelectorAll(".stat-num");

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && !reduceMotion) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => counterObserver.observe(c));
  } else {
    counters.forEach((c) => {
      c.textContent = parseFloat(c.dataset.count).toFixed(parseInt(c.dataset.decimals || "0", 10));
    });
  }

  /* ---------- 7. Toast helper ---------- */
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
  }

  /* ---------- 8. Placeholder links ----------
     Links that still have href="#" and a data-placeholder attribute
     show a friendly message instead of jumping to the top of the page.
     Once you replace href="#" with a real URL, this no longer applies. */
  document.querySelectorAll(".placeholder-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.getAttribute("href") === "#") {
        e.preventDefault();
        showToast(`Link not added yet: ${link.dataset.placeholder}`);
      }
    });
  });

  /* ---------- 9. Contact form validation ---------- */
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");

  const rules = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name (at least 2 characters)."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address."),
    subject: (v) => (v.trim().length >= 3 ? "" : "Please enter a subject (at least 3 characters)."),
    message: (v) => (v.trim().length >= 10 ? "" : "Please write a message (at least 10 characters)."),
  };

  function validateField(field) {
    const error = rules[field.name](field.value);
    const group = field.closest(".form-group");
    document.getElementById(`${field.name}Error`).textContent = error;
    group.classList.toggle("invalid", Boolean(error));
    field.setAttribute("aria-invalid", error ? "true" : "false");
    return !error;
  }

  // Re-check a field as the user types, once it has been marked invalid
  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.closest(".form-group").classList.contains("invalid")) validateField(field);
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    statusEl.className = "form-status";

    let firstInvalid = null;
    Object.keys(rules).forEach((name) => {
      const field = form.elements[name];
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      statusEl.textContent = "Please fix the highlighted fields.";
      statusEl.classList.add("error");
      firstInvalid.focus();
      return;
    }

    /* -------------------------------------------------------
       The form is valid. To actually deliver emails, connect a
       form service here (e.g. Formspree):

       fetch("https://formspree.io/f/YOUR_FORM_ID", {
         method: "POST",
         body: new FormData(form),
         headers: { Accept: "application/json" },
       }).then(...)
       ------------------------------------------------------- */
    statusEl.textContent = "Thank you! Your message passed validation. (Demo mode — connect a form service to receive emails.)";
    statusEl.classList.add("success");
    form.reset();
    form.querySelectorAll(".form-group").forEach((g) => g.classList.remove("invalid"));
  });
});
