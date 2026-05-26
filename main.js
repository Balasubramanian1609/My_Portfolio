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
  ".skill__card",
  ".project__card",
  ".contact__card",
  ".footer",
];

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
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

const animateSkills = () => {
  const counters = document.querySelectorAll(".count-up");

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 1. Animate the Progress Bar (Width)
        const progress = entry.target.querySelector(".progress");
        if (progress) {
          const width = progress.getAttribute("data-width");
          setTimeout(() => {
            progress.style.width = width;
          }, 500); // Small delay to ensure visibility
        }

        // 2. Animate the Percentage Numbers (Counting)
        const counters = entry.target.querySelectorAll(".count-up");
        counters.forEach((counter) => {
          const target = +counter.getAttribute("data-target");
          const duration = 2000; // 2 seconds to match the CSS transition
          const increment = target / (duration / 16); // ~60fps logic

          let currentCount = 0;
          const updateCount = () => {
            currentCount += increment;
            if (currentCount < target) {
              counter.innerText = Math.ceil(currentCount);
              requestAnimationFrame(updateCount);
            } else {
              counter.innerText = target;
            }
          };
          updateCount();
        });

        // Stop observing once animation is triggered
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 }); // Trigger when 50% of the card is visible

  // Observe each skill card
  document.querySelectorAll(".skill__card").forEach((card) => {
    skillObserver.observe(card);
  });
};

// Initialize the function
document.addEventListener("DOMContentLoaded", animateSkills);

document.addEventListener("DOMContentLoaded", () => {
  const revealElements = revealSelectors.flatMap((selector) =>
    Array.from(document.querySelectorAll(selector))
  );

  const uniqueElements = [...new Set(revealElements)];
  uniqueElements.forEach((element) => {
    element.classList.add("scroll-reveal");
    revealObserver.observe(element);
  });

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

