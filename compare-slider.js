/* Before/after comparison slider (editing.html).

   Each ".compare" block holds two stacked photos and an invisible
   <input type="range">. The current position lives in a --pos custom
   property on the block, which the CSS uses to clip the edited photo and
   place the divider.

   Dragging is handled here with pointer events on the whole block, so it
   works the same with a mouse, a finger or a pen: press anywhere on the
   photo and slide. (An invisible range input alone is unreliable on
   phones — iOS Safari only moves it when the tiny thumb itself is hit.)
   touch-action: pan-y in the CSS keeps vertical swipes scrolling the page
   while horizontal ones move the slider.

   The range input stays for keyboard and screen-reader users: arrow keys
   move it and it is announced as a slider. Both paths keep it in sync.
*/
(function () {
  document.querySelectorAll(".compare").forEach(function (compare) {
    var range = compare.querySelector(".compare-range");
    if (!range) return;

    var set = function (value) {
      value = Math.max(0, Math.min(100, value));
      range.value = value;
      compare.style.setProperty("--pos", value + "%");
    };

    var fromPointer = function (event) {
      var rect = compare.getBoundingClientRect();
      set(((event.clientX - rect.left) / rect.width) * 100);
    };

    var dragging = false;

    compare.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging = true;
      if (compare.setPointerCapture) compare.setPointerCapture(event.pointerId);
      fromPointer(event);
    });

    compare.addEventListener("pointermove", function (event) {
      if (dragging) fromPointer(event);
    });

    var stop = function () { dragging = false; };
    compare.addEventListener("pointerup", stop);
    compare.addEventListener("pointercancel", stop);
    compare.addEventListener("lostpointercapture", stop);

    /* Keyboard (arrow keys) and assistive tech go through the range. */
    range.addEventListener("input", function () {
      set(parseFloat(range.value));
    });

    set(parseFloat(range.value) || 50);
  });
})();
