document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("seat-reservation-form");
  const submitBtn = form.querySelector(".theme-btn");
  const message = form.querySelector(".form-message");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Add loading state
    submitBtn.classList.add("loading");

    // Simulate form submission
    setTimeout(function () {
      submitBtn.classList.remove("loading");
      message.className = "form-message text-center success show";
      message.textContent =
        "Success! Your seat has been reserved. You will receive a confirmation email shortly.";
      form.reset();

      // Hide message after 5 seconds
      setTimeout(function () {
        message.classList.remove("show");
      }, 5000);
    }, 2000);
  });

  // Input validation feedback
  const inputs = form.querySelectorAll(".form-control");
  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.checkValidity()) {
        this.style.borderColor = "#28a745";
      } else {
        this.style.borderColor = "#dc3545";
      }
    });

    input.addEventListener("input", function () {
      if (this.value.length > 0) {
        this.style.borderColor = "#ffd700";
      }
    });
  });
});
