/* Hero photo control (index.html).

   The slides crossfade on their own in pure CSS, so with JavaScript off
   the hero still rotates — see @keyframes heroFade in styles.css. This
   file layers manual control on top: it adds a previous/next arrow pair,
   and the first time someone uses one the hero switches to manual mode.
   The CSS rotation stops there and the chosen photo stays up until the
   visitor moves again, so they read the hero at their own pace.

   Arrows, the left/right keys, and a swipe on touch all go through the
   same step() call. The arrows are built here rather than written into
   the HTML so they never appear as dead controls when scripts are off.
*/
(function () {
  var hero = document.querySelector(".hero");
  if (!hero) return;

  var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
  if (slides.length < 2) return;

  var index = 0;
  var manual = false;

  var PATHS = { prev: "M15 5l-7 7 7 7", next: "M9 5l7 7-7 7" };

  var makeArrow = function (dir, label) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "hero-arrow hero-arrow--" + dir;
    button.setAttribute("aria-label", label);
    button.innerHTML =
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" ' +
      'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true"><path d="' + PATHS[dir] + '"/></svg>';
    button.addEventListener("click", function () {
      step(dir === "prev" ? -1 : 1);
    });
    return button;
  };

  /* Which slide is on screen right now. While the CSS animation is still
     running the opacities are mid-fade, so the brightest one wins — that
     way taking over never jumps to a different photo than the one being
     looked at. */
  var visibleIndex = function () {
    var best = 0;
    var bestOpacity = -1;
    slides.forEach(function (slide, i) {
      var opacity = parseFloat(window.getComputedStyle(slide).opacity) || 0;
      if (opacity > bestOpacity) {
        bestOpacity = opacity;
        best = i;
      }
    });
    return best;
  };

  var render = function () {
    slides.forEach(function (slide, i) {
      slide.classList.toggle("is-active", i === index);
    });
  };

  var step = function (delta) {
    var from = manual ? index : visibleIndex();
    if (!manual) {
      manual = true;
      hero.classList.add("is-manual");
    }
    index = (from + delta + slides.length) % slides.length;
    render();
  };

  hero.appendChild(makeArrow("prev", hero.dataset.prevLabel || "Previous photo"));
  hero.appendChild(makeArrow("next", hero.dataset.nextLabel || "Next photo"));

  hero.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      step(-1);
    } else if (event.key === "ArrowRight") {
      step(1);
    }
  });

  /* Horizontal swipe, ignoring mostly-vertical drags so scrolling still works. */
  var startX = null;
  var startY = null;

  hero.addEventListener("touchstart", function (event) {
    startX = event.changedTouches[0].clientX;
    startY = event.changedTouches[0].clientY;
  }, { passive: true });

  hero.addEventListener("touchend", function (event) {
    if (startX === null) return;
    var dx = event.changedTouches[0].clientX - startX;
    var dy = event.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      step(dx < 0 ? 1 : -1);
    }
    startX = null;
    startY = null;
  }, { passive: true });
})();
