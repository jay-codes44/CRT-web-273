/* Six Thinking Hats · Case Scenario 2 — animations & interactions */
(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- Preloader: hide when loaded ---- */
  window.addEventListener("load", function () {
    setTimeout(function () { document.body.classList.add("loaded"); }, 350);
  });
  // safety fallback
  setTimeout(function () { document.body.classList.add("loaded"); }, 4500);

  /* ---- Mobile nav toggle ---- */
  var toggle = $("#navToggle");
  var links = $("#navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Scroll: progress bar + navbar + back-to-top + active nav ---- */
  var progress = $("#progressBar");
  var nav = $("#topnav");
  var backTop = $("#backTop");
  var navAnchors = $$(".nav-links a");
  var sections = ["scenario", "white", "blue", "red", "black", "yellow", "green", "conclusion", "poster"]
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function onScroll() {
    var y = window.scrollY;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? (y / h) * 100 : 0;
    if (progress) progress.style.width = p + "%";
    if (nav) nav.classList.toggle("scrolled", y > 40);
    if (backTop) backTop.classList.toggle("visible", y > 500);

    // active nav link
    var current = "";
    sections.forEach(function (sec) {
      if (sec && y >= sec.offsetTop - 180) current = sec.id;
    });
    navAnchors.forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---- Reveal on scroll (with stagger) ---- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Subtle 3D tilt on cards ---- */
  function makeTilt(el, max) {
    max = max || 6;
    el.addEventListener("mousemove", function (ev) {
      var r = el.getBoundingClientRect();
      var x = (ev.clientX - r.left) / r.width - 0.5;
      var y = (ev.clientY - r.top) / r.height - 0.5;
      el.style.transform =
        "perspective(900px) rotateX(" + (-y * max).toFixed(2) + "deg) rotateY(" +
        (x * max).toFixed(2) + "deg) translateY(-4px)";
    });
    el.addEventListener("mouseleave", function () {
      el.style.transform = "";
    });
  }
  $$(".tilt-card").forEach(function (el) { makeTilt(el, 4); });

  var poster = $("#poster");
  if (poster) makeTilt(poster, 3);

  /* ---- Decor: floating sparkles on the poster ---- */
  function sparkles() {
    if (!poster) return;
    var count = 8;
    for (var i = 0; i < count; i++) {
      var s = document.createElement("span");
      s.className = "sparkle";
      var size = 3 + Math.random() * 4;
      s.style.width = s.style.height = size + "px";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDelay = Math.random() * 4 + "s";
      poster.appendChild(s);
    }
  }
  sparkles();

  /* ---- Add sparkle styles on the fly ---- */
  var style = document.createElement("style");
  style.textContent =
    ".sparkle{position:absolute;border-radius:50%;background:rgba(244,201,100,.8);pointer-events:none;" +
    "box-shadow:0 0 8px rgba(244,201,100,.9);animation:spark 4s ease-in-out infinite}" +
    "@keyframes spark{0%,100%{opacity:0;transform:scale(.4)}50%{opacity:.9;transform:scale(1.1)}}";
  document.head.appendChild(style);
})();
