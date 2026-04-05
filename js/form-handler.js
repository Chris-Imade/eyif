// Base URL for API endpoints
const BASE_URL = "https://eyif-server-vuqh.onrender.com";

// ─── Utility Functions ───────────────────────────────────────────────

// Sanitize string to prevent XSS when inserting into DOM
function sanitizeText(str) {
  if (typeof str !== "string") return str;
  var div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Email validation
function isValidEmail(email) {
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Convert snake_case to camelCase (for form field names → backend model keys)
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, function (_, letter) {
    return letter.toUpperCase();
  });
}

// Map frontend edo_connection values to backend enum values
function mapEdoConnection(value) {
  var map = {
    resident: "Resident",
    indigene: "Indigene",
    business_based: "Business Based",
  };
  return map[value] || value;
}

// Helper function to convert category values to backend format
function convertCategoryFormat(category) {
  var categoryMap = {
    education: "basic-education",
    agriculture: "agriculture-food",
    environment: "waste-environment",
    culture: "culture-arts",
    health: "youth-wellbeing",
    skills: "skills-work",
    transport: "transportation",
  };
  return categoryMap[category] || category;
}

// ─── Feedback Display ────────────────────────────────────────────────

function showFormFeedback(form, message, type) {
  var feedbackElement = form.querySelector(".form-feedback, .form-message");
  if (!feedbackElement) {
    feedbackElement = document.createElement("div");
    feedbackElement.className = "form-feedback";
    form.appendChild(feedbackElement);
  }

  var icon =
    type === "success" ? "fa-check-circle" : "fa-exclamation-circle";
  feedbackElement.innerHTML =
    '<i class="fa ' + icon + '"></i> ' + sanitizeText(message);
  feedbackElement.className = "form-feedback " + type;

  // Support .form-message styling from seat-reservation pages
  if (feedbackElement.classList.contains("form-message")) {
    feedbackElement.classList.add("show");
    feedbackElement.style.opacity = 1;
    feedbackElement.style.display = "block";
  }
}

function clearFormFeedback(form) {
  var el = form.querySelector(".form-feedback, .form-message");
  if (el) {
    el.innerHTML = "";
    el.className = "form-feedback";
    el.style.opacity = 0;
  }
}

// ─── Success Messages ────────────────────────────────────────────────

function getSuccessMessage(endpoint, serverMessage) {
  if (serverMessage) return serverMessage;
  switch (endpoint) {
    case "/contact":
      return "Thank you for your message! We'll contact you soon.";
    case "/grant-registration":
      return "Your grant application has been submitted successfully! We'll review it and get back to you.";
    case "/subscribe":
      return "Successfully subscribed to our newsletter!";
    case "/reserve-seat":
      return "Your seat has been reserved successfully! You'll receive a confirmation email shortly.";
    case "/apply/idea":
      return "Your Idea Track application has been submitted successfully! We'll review it and get back to you.";
    case "/apply/build":
      return "Your Build Track application has been submitted successfully! We'll review it and get back to you.";
    case "/apply/scale":
      return "Your Scale Track application has been submitted successfully! We'll review it and get back to you.";
    default:
      return "Form submitted successfully!";
  }
}

// Post-success actions
function handlePostSuccess(endpoint) {
  if (endpoint === "/grant-registration") {
    setTimeout(function () {
      if (confirm("Would you like to reserve a seat for the event?")) {
        window.location.href = "seat-reservation.html";
      }
    }, 2000);
  }
}

// ─── Generic Form Submission (real API calls) ────────────────────────

async function submitForm(formElement, endpoint, getData, options) {
  options = options || {};
  var submitBtn = formElement.querySelector(
    'button[type="submit"], .submit-btn, .theme-btn'
  );
  var originalBtnText = submitBtn ? submitBtn.innerHTML : "";
  var timeout = options.timeout || 30000;

  if (submitBtn) {
    submitBtn.innerHTML =
      '<span class="spinner"><i class="fa fa-spinner fa-spin"></i></span> Processing...';
    submitBtn.disabled = true;
  }

  clearFormFeedback(formElement);

  try {
    var data = typeof getData === "function" ? getData() : getData;

    var controller = new AbortController();
    var timeoutId = setTimeout(function () {
      controller.abort();
    }, timeout);

    var response = await fetch(BASE_URL + endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    var result = {};
    try {
      result = await response.json();
    } catch (_) {
      // response may not be JSON
    }

    if (!response.ok) {
      throw new Error(
        result.message || "Server error (" + response.status + ")"
      );
    }

    // Success
    var successMessage = getSuccessMessage(endpoint, result.message);
    showFormFeedback(formElement, successMessage, "success");
    formElement.reset();

    // Reset custom UI elements
    if (
      endpoint === "/grant-registration" ||
      endpoint.startsWith("/apply/")
    ) {
      document.querySelectorAll(".category-card").forEach(function (card) {
        card.classList.remove("active");
      });
    }

    handlePostSuccess(endpoint);
    return result;
  } catch (error) {
    var errorMessage = "Something went wrong. Please try again.";

    if (error.name === "AbortError") {
      errorMessage =
        "Request timed out. Please check your connection and try again.";
    } else if (typeof navigator !== "undefined" && !navigator.onLine) {
      errorMessage =
        "You appear to be offline. Please check your internet connection.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error("Form submission error:", error);
    showFormFeedback(formElement, errorMessage, "error");
    throw error;
  } finally {
    if (submitBtn) {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  }
}

// ─── Contact Form ────────────────────────────────────────────────────

function initContactForm() {
  var form = document.getElementById("email-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var firstName = (
      form.querySelector('[name="firstName"]') || {}
    ).value;
    var lastName = (
      form.querySelector('[name="lastName"]') || {}
    ).value;
    var email = (form.querySelector('[name="email"]') || {}).value;
    var phone = (form.querySelector('[name="phone"]') || {}).value;
    var message = (
      form.querySelector('[name="message"]') || {}
    ).value;

    firstName = firstName ? firstName.trim() : "";
    lastName = lastName ? lastName.trim() : "";
    email = email ? email.trim() : "";
    phone = phone ? phone.trim() : "";
    message = message ? message.trim() : "";

    // Validation
    var errors = [];
    if (!firstName) errors.push("First name is required");
    if (!lastName) errors.push("Last name is required");
    if (!email) errors.push("Email is required");
    else if (!isValidEmail(email)) errors.push("Please enter a valid email address");
    if (!phone) errors.push("Phone number is required");
    if (!message) errors.push("Message is required");

    if (errors.length) {
      showFormFeedback(form, errors.join(". "), "error");
      return;
    }

    submitForm(form, "/contact", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      message: message,
    });
  });
}

// ─── Newsletter Subscription ─────────────────────────────────────────

function initNewsletterForms() {
  var forms = document.querySelectorAll(
    ".newsletter-form-two form, .subscribe-form form, #newsletter-form"
  );

  forms.forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var emailInput = form.querySelector('input[type="email"]');
      if (!emailInput) return;

      var email = emailInput.value.trim();
      if (!email) {
        showFormFeedback(form, "Email address is required.", "error");
        return;
      }
      if (!isValidEmail(email)) {
        showFormFeedback(
          form,
          "Please enter a valid email address.",
          "error"
        );
        return;
      }

      submitForm(form, "/subscribe", { email: email });
    });
  });
}

// ─── Seat Reservation ────────────────────────────────────────────────

function initSeatReservationForm() {
  var form = document.getElementById("seat-reservation-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var firstName = (
      form.querySelector('[name="first_name"]') || {}
    ).value;
    var lastName = (
      form.querySelector('[name="last_name"]') || {}
    ).value;
    var email = (form.querySelector('[name="email"]') || {}).value;
    var phone = (form.querySelector('[name="phone"]') || {}).value;

    firstName = firstName ? firstName.trim() : "";
    lastName = lastName ? lastName.trim() : "";
    email = email ? email.trim() : "";
    phone = phone ? phone.trim() : "";

    var errors = [];
    if (!firstName) errors.push("First name is required");
    if (!lastName) errors.push("Last name is required");
    if (!email) errors.push("Email is required");
    else if (!isValidEmail(email)) errors.push("Please enter a valid email address");
    if (!phone) errors.push("Phone number is required");

    if (errors.length) {
      showFormFeedback(form, errors.join(". "), "error");
      return;
    }

    submitForm(form, "/reserve-seat", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
    });
  });
}

// ─── Grant Registration (old 2025 form) ──────────────────────────────

function initGrantRegistrationForm() {
  var form = document.getElementById("grant-registration-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var formData = new FormData(form);
    var jsonData = {};
    formData.forEach(function (value, key) {
      if (key === "category") {
        jsonData[key] = convertCategoryFormat(value);
      } else {
        jsonData[key] = value;
      }
    });

    submitForm(form, "/grant-registration", jsonData);
  });
}

// ─── 2026 Grant Track Applications (Idea / Build / Scale) ───────────

// Numeric fields that need type conversion before sending to backend
var NUMERIC_FIELDS = [
  "age",
  "customersSpoken",
  "jobsCreated",
  "currentUsers",
  "monthlyActiveUsers",
  "monthlyRevenue",
  "teamSize",
  "totalUsers",
  "annualRevenue",
  "growthRate",
  "cac",
  "ltv",
  "burnRate",
  "runway",
  "yearFounded",
];

// Called from onsubmit="submitApplication(event, 'idea')" etc. in grant-registration.html
function submitApplication(event, tier) {
  event.preventDefault();
  var form = event.target;
  var formData = new FormData(form);
  var rawData = {};
  formData.forEach(function (value, key) {
    rawData[key] = value;
  });

  // Convert snake_case form field names to camelCase backend keys
  var data = {};
  Object.keys(rawData).forEach(function (key) {
    var camelKey = snakeToCamel(key);
    var value = rawData[key];

    // Map edo connection values to match backend enum
    if (camelKey === "edoConnection") {
      data[camelKey] = mapEdoConnection(value);
    } else {
      data[camelKey] = value;
    }
  });

  // Convert numeric fields from string to number
  NUMERIC_FIELDS.forEach(function (field) {
    if (data[field] !== undefined && data[field] !== "") {
      data[field] = Number(data[field]);
    }
  });

  var endpoint = "/apply/" + tier;
  submitForm(form, endpoint, data);
}

// ─── Initialization ──────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function () {
  initContactForm();
  initGrantRegistrationForm();
  initNewsletterForms();
  initSeatReservationForm();

  // Inject feedback & spinner styles
  var style = document.createElement("style");
  style.textContent =
    ".form-feedback, .form-message {" +
    "  margin-top: 15px; padding: 10px 15px; border-radius: 5px; display: none;" +
    "}" +
    ".form-feedback.success, .form-message.success {" +
    "  display: block; background-color: rgba(40,167,69,0.1);" +
    "  border-left: 4px solid #28a745; color: #28a745;" +
    "}" +
    ".form-feedback.error, .form-message.error {" +
    "  display: block; background-color: rgba(220,53,69,0.1);" +
    "  border-left: 4px solid #dc3545; color: #dc3545;" +
    "}" +
    ".form-message.show { display: block !important; }" +
    ".spinner { margin-right: 8px; display: inline-block; }" +
    "button:disabled { opacity: 0.7; cursor: not-allowed; }";
  document.head.appendChild(style);
});
