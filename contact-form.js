/* Contact form submission — no backend of your own needed.
   Uses FormSubmit (https://formsubmit.co), a free form-to-email service:
   the form POSTs to formsubmit.co/<your email>, and this script submits
   it via fetch so the page shows an inline confirmation instead of
   redirecting or reloading.

   ONE-TIME SETUP: the first time this form is ever submitted (by
   anyone, including your own test), FormSubmit sends a confirmation
   email to the address in the form's "action" attribute. Until that
   email is confirmed by clicking the link inside it, messages sent
   through the form will NOT actually arrive by email — so send one
   test message yourself first and confirm it.
*/
(function () {
  var form = document.querySelector(".contact-form");
  if (!form) return;

  var statusEl = document.getElementById("form-status");
  var button = form.querySelector('button[type="submit"]');
  var originalButtonText = button.textContent;

  var sendingText = form.dataset.sending || "Sending…";
  var successText = form.dataset.success || "Thanks — your message has been sent.";
  var errorText = form.dataset.error || "Something went wrong. Please try again, or email me directly.";

  // FormSubmit's plain action URL (works with no JS as a fallback) has
  // an /ajax/ counterpart that responds with JSON instead of a redirect.
  var ajaxEndpoint = form.getAttribute("action").replace("formsubmit.co/", "formsubmit.co/ajax/");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var data = {};
    new FormData(form).forEach(function (value, key) {
      data[key] = value;
    });

    statusEl.hidden = true;
    statusEl.classList.remove("success", "error");
    button.disabled = true;
    button.textContent = sendingText;

    fetch(ajaxEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (response) {
        if (!response.ok) throw new Error("Request failed with status " + response.status);
        form.reset();
        statusEl.textContent = successText;
        statusEl.classList.add("success");
      })
      .catch(function () {
        statusEl.textContent = errorText;
        statusEl.classList.add("error");
      })
      .finally(function () {
        statusEl.hidden = false;
        button.disabled = false;
        button.textContent = originalButtonText;
      });
  });
})();
