const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const revealSelectors = [
  "nav",
  ".about__content",
  ".about__btn",
  ".section__header",
  ".section__description",
  ".tool__card",          /* Added for staggered card popups */
  ".core__card",          /* Added for shift effects */
  ".pro__item",
  ".project__card",
  ".contact__card",
  ".footer",
];

// SINGLE COMBINED OBSERVER: Handles scroll-reveals and progress bar loading together
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 1. Reveal the element onto the screen
        entry.target.classList.add("visible");
        
        // 2. If it's a tool card, grab its nested skill span and trigger width expansion
        if (entry.target.classList.contains("tool__card")) {
          const bar = entry.target.querySelector(".tool__bar span");
          if (bar) {
            const width = bar.getAttribute("data-width");
            bar.style.width = width;
          }
        }

        // Stop watching this specific item since its animation is done
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15, // Triggers when 15% of the element is visible
  }
);

function wrapCharacters(element, className) {
  const text = element.textContent;
  element.innerHTML = "";
  let delay = 0;
  for (let char of text) {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = char;
    span.style.animationDelay = delay + "ms";
    element.appendChild(span);
    delay += 30;
  }
}

function wrapWords(element, className) {
  const text = element.textContent;
  const words = text.split(/\s+/);
  element.innerHTML = "";
  let delay = 0;
  words.forEach((word) => {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = word;
    span.style.animationDelay = delay + "ms";
    element.appendChild(span);
    const spaceNode = document.createTextNode(" ");
    element.appendChild(spaceNode);
    delay += 100;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. Gather all elements matches from your reveal selectors
  const revealElements = revealSelectors.flatMap((selector) =>
    Array.from(document.querySelectorAll(selector))
  );

  // 2. Filter out duplicates and observe them
  const uniqueElements = [...new Set(revealElements)];
  uniqueElements.forEach((element) => {
    element.classList.add("scroll-reveal");
    revealObserver.observe(element);
  });

  // 3. Header Text & Elements split layout handling
  const headerText = document.querySelector(".header__content");
  const headerImage = document.querySelector(".header__image");

  if (headerText) {
    headerText.classList.add("scroll-reveal", "scroll-reveal-left");
    revealObserver.observe(headerText);

    const h1 = headerText.querySelector("h1");
    const h2 = headerText.querySelector("h2");
    const description = headerText.querySelector(".section__description");

    if (h1) wrapWords(h1, "word");
    if (h2) wrapWords(h2, "word");
    if (description) wrapWords(description, "word");
  }

  if (headerImage) {
    headerImage.classList.add("scroll-reveal", "scroll-reveal-right");
    revealObserver.observe(headerImage);
  }
});