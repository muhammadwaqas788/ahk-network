/* =========================================================
   AHK NETWORK — Main Script
========================================================= */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {

    /* ---------- Preloader ---------- */
    var preloader = document.getElementById("ahk-preloader");
    window.addEventListener("load", function () {
      if (preloader) {
        setTimeout(function () { preloader.classList.add("loaded"); }, 250);
      }
    });
    // Fallback in case 'load' already fired
    setTimeout(function () {
      if (preloader) preloader.classList.add("loaded");
    }, 1500);

    /* ---------- Navbar scroll state ---------- */
    var navbar = document.querySelector(".ahk-navbar");
    function onScroll() {
      if (!navbar) return;
      if (window.scrollY > 30) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
      toggleScrollTop();
    }
    window.addEventListener("scroll", onScroll);
    onScroll();

    /* ---------- Active nav link highlighting ---------- */
    var currentPage = (window.location.pathname.split("/").pop() || "index.html");
    document.querySelectorAll(".ahk-navbar .nav-link").forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === currentPage || (currentPage === "" && href === "index.html")) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      }
    });

    /* ---------- Scroll to top button ---------- */
    var scrollBtn = document.getElementById("ahk-scrolltop");
    function toggleScrollTop() {
      if (!scrollBtn) return;
      if (window.scrollY > 400) {
        scrollBtn.classList.add("show");
      } else {
        scrollBtn.classList.remove("show");
      }
    }
    if (scrollBtn) {
      scrollBtn.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    /* ---------- Reveal on scroll ---------- */
    var revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window && revealEls.length) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    }

    /* ---------- Animated stat counters ---------- */
    var counters = document.querySelectorAll("[data-counter]");
    if ("IntersectionObserver" in window && counters.length) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    }
    function animateCounter(el) {
      var target = parseInt(el.getAttribute("data-counter"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1400;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toLocaleString() + suffix;
      }
      requestAnimationFrame(step);
    }

    /* ---------- Bootstrap form validation ---------- */
    var forms = document.querySelectorAll(".needs-validation");
    Array.prototype.slice.call(forms).forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (!form.checkValidity()) {
          form.classList.add("was-validated");
          return;
        }
        form.classList.add("was-validated");
        var successBox = form.parentElement.querySelector(".form-success");
        if (successBox) {
          form.classList.add("d-none");
          successBox.classList.remove("d-none");
        }
      });
    });

    /* ---------- Legal page TOC active state ---------- */
    var tocLinks = document.querySelectorAll(".legal-toc a");
    var legalSections = document.querySelectorAll(".legal-section[id]");
    if (tocLinks.length && legalSections.length && "IntersectionObserver" in window) {
      var tocObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var id = entry.target.getAttribute("id");
          var link = document.querySelector('.legal-toc a[href="#' + id + '"]');
          if (!link) return;
          if (entry.isIntersecting) {
            tocLinks.forEach(function (l) { l.classList.remove("active"); });
            link.classList.add("active");
          }
        });
      }, { rootMargin: "-40% 0px -50% 0px" });
      legalSections.forEach(function (sec) { tocObserver.observe(sec); });
    }

    /* ---------- Auto year in footer ---------- */
    document.querySelectorAll(".ahk-year").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });

  });
})();
