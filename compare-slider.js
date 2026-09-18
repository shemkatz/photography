/* Before/after comparison slider (editing.html).
   Each ".compare" block contains a hidden <input type="range"> layered
   over two stacked "photos". Dragging the (invisible) range updates a
   --pos custom property on the block, which the CSS uses to clip the
   "after" photo and position the divider line. Using a native range
   input means drag, click, tap, and arrow-key keyboard control all work
   without extra code, and screen readers announce it as a slider.
*/
(function () {
  var ranges = document.querySelectorAll(".compare-range");

  ranges.forEach(function (range) {
    var compare = range.closest(".compare");
    if (!compare) return;

    var update = function () {
      compare.style.setProperty("--pos", range.value + "%");
    };

    range.addEventListener("input", update);
    update();
  });
})();
