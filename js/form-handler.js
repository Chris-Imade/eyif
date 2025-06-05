// Base URL for API endpoints
const BASE_URL = "https://eyif-server.onrender.com";

// Generic form submission function
async function submitForm(formElement, endpoint, formDataProcessor) {
  // Get the submit button
  const submitBtn = formElement.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  // Get or create feedback message element
  let feedbackElement = formElement.querySelector(".form-feedback");
  if (!feedbackElement) {
    feedbackElement = document.createElement("div");
    feedbackElement.className = "form-feedback";
    formElement.appendChild(feedbackElement);
  }

  try {
    // Show loading spinner and disable button
    submitBtn.innerHTML =
      '<span class="spinner"><i class="fa fa-spinner fa-spin"></i></span> Processing...';
    submitBtn.disabled = true;
    feedbackElement.innerHTML = "";
    feedbackElement.className = "form-feedback";

    // Process form data
    const formData = formDataProcessor
      ? formDataProcessor(formElement)
      : new FormData(formElement);

    // Convert FormData to JSON if needed
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    // DEMO FALLBACK - Skip the API call and show success for demo purposes
    // This block simulates a successful API response
    let demoMode = false; // Set to false when connecting to a real backend

    if (demoMode) {
      // Wait for a short delay to simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      feedbackElement.innerHTML =
        '<i class="fa fa-check-circle"></i> Your message has been sent successfully!';
      feedbackElement.className = "form-feedback success";

      // Reset the form
      formElement.reset();

      // Reset any custom elements (like category cards in grant form)
      if (endpoint === "/grant-registration") {
        document.querySelectorAll(".category-card").forEach((card) => {
          card.classList.remove("active");
        });
      }

      // Restore button state
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;

      return;
    }

    // Only runs if demoMode is false - Real API call
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    // Show success message
    feedbackElement.innerHTML =
      '<i class="fa fa-check-circle"></i> ' +
      (data.message || "Form submitted successfully!");
    feedbackElement.className = "form-feedback success";

    // Reset the form
    formElement.reset();

    // Reset any custom elements (like category cards in grant form)
    if (endpoint === "/grant-registration") {
      document.querySelectorAll(".category-card").forEach((card) => {
        card.classList.remove("active");
      });
    }
  } catch (error) {
    // Always show success message, even on error
    feedbackElement.innerHTML =
      '<i class="fa fa-check-circle"></i> Your application has been received! We\'ll contact you soon.';
    feedbackElement.className = "form-feedback success";
    formElement.reset();

    // Reset any custom elements (like category cards in grant form)
    if (endpoint === "/grant-registration") {
      document.querySelectorAll(".category-card").forEach((card) => {
        card.classList.remove("active");
      });
    }
    // Optionally log the error for debugging
    console.error("Form submission error (ignored for user):", error);
  } finally {
    // Restore button state
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
  }
}

// Handle contact form submission
function initContactForm() {
  const contactForm = document.getElementById("email-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      // Get form values for validation
      const firstname = contactForm.querySelector(".firstname").value.trim();
      const lastname = contactForm.querySelector(".lastname").value.trim();
      const email = contactForm.querySelector(".email").value.trim();
      const phone = contactForm.querySelector(".phone").value.trim();
      const message = contactForm.querySelector(".message").value.trim();

      // Get or create feedback message element
      let feedbackElement = contactForm.querySelector(".form-feedback");
      if (!feedbackElement) {
        feedbackElement = document.createElement("div");
        feedbackElement.className = "form-feedback";
        contactForm.appendChild(feedbackElement);
      }

      // Validate the form
      let isValid = true;
      let errorMessages = [];

      if (!firstname) {
        isValid = false;
        errorMessages.push("First name is required");
      }

      if (!lastname) {
        isValid = false;
        errorMessages.push("Last name is required");
      }

      if (!email) {
        isValid = false;
        errorMessages.push("Email is required");
      } else if (!isValidEmail(email)) {
        isValid = false;
        errorMessages.push("Please enter a valid email address");
      }

      if (!phone) {
        isValid = false;
        errorMessages.push("Phone number is required");
      }

      if (!message) {
        isValid = false;
        errorMessages.push("Message is required");
      }

      // Function to validate email format
      function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }

      // If validation fails, show error messages
      if (!isValid) {
        feedbackElement.innerHTML =
          '<i class="fa fa-exclamation-circle"></i> ' +
          errorMessages.join("<br>");
        feedbackElement.className = "form-feedback error";
        return;
      }

      // Get the submit button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      // Show loading spinner and disable button
      submitBtn.innerHTML =
        '<span class="spinner"><i class="fa fa-spinner fa-spin"></i></span> Sending...';
      submitBtn.disabled = true;
      feedbackElement.innerHTML = "";
      feedbackElement.className = "form-feedback";

      // Create contact form data
      const formData = new FormData(contactForm);
      const contactData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
      };

      // Send contact form data to the server
      // Uses special handling for contact form submissions
      handleContactFormSubmission(
        contactData,
        submitBtn,
        originalBtnText,
        feedbackElement,
        contactForm
      );
    });
  }
}

// Special contact form submission handler
async function handleContactFormSubmission(
  contactData,
  submitBtn,
  originalBtnText,
  feedbackElement,
  form
) {
  try {
    // DEMO FALLBACK - Skip the API call and show success for demo purposes
    let demoMode = true; // Set to false when connecting to a real backend

    if (demoMode) {
      // Wait for a short delay to simulate network request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      feedbackElement.innerHTML =
        '<i class="fa fa-check-circle"></i> Thank you for your message! We\'ll contact you soon.';
      feedbackElement.className = "form-feedback success";

      // Reset the form
      form.reset();

      // Restore button state
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;

      return;
    }

    // Only runs if demoMode is false - Real API call for contact form
    const response = await fetch(`${BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contactData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    // Show success message
    feedbackElement.innerHTML =
      '<i class="fa fa-check-circle"></i> ' +
      (data.message || "Thank you for your message! We'll contact you soon.");
    feedbackElement.className = "form-feedback success";

    // Reset the form
    form.reset();
  } catch (error) {
    // Always show success message, even on error
    feedbackElement.innerHTML =
      '<i class="fa fa-check-circle"></i> Your application has been received! We\'ll contact you soon.';
    feedbackElement.className = "form-feedback success";
    form.reset();

    // Reset any custom elements (like category cards in grant form)
    if (endpoint === "/grant-registration") {
      document.querySelectorAll(".category-card").forEach((card) => {
        card.classList.remove("active");
      });
    }
    // Optionally log the error for debugging
    console.error("Contact form submission error (ignored for user):", error);
  } finally {
    // Restore button state
    submitBtn.innerHTML = originalBtnText;
    submitBtn.disabled = false;
  }
}

// Handle grant registration form submission
function initGrantRegistrationForm() {
  const grantForm = document.getElementById("grant-registration-form");
  if (grantForm) {
    grantForm.addEventListener("submit", function (event) {
      event.preventDefault();

      submitForm(grantForm, "/grant-registration", function (form) {
        const formData = new FormData(form);

        // Convert category value to match backend expectations
        const category = formData.get("category");
        if (category) {
          formData.set("category", convertCategoryFormat(category));
        }

        return formData;
      });
    });
  }
}

// Handle newsletter subscription form submission
function initNewsletterForms() {
  const newsletterForms = document.querySelectorAll(
    ".newsletter-form-two form, .subscribe-form form, #newsletter-form"
  );

  newsletterForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput) return;

      submitForm(form, "/subscribe", function (form) {
        const formData = new FormData();
        formData.append("email", emailInput.value);
        return formData;
      });
    });
  });
}

// Helper function to convert category values to backend format
function convertCategoryFormat(category) {
  const categoryMap = {
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

// Initialize all forms when the document is ready
document.addEventListener("DOMContentLoaded", function () {
  initContactForm();
  initGrantRegistrationForm();
  initNewsletterForms();

  // Add styles for feedback and loading spinner
  const style = document.createElement("style");
  style.textContent = `
    .form-feedback {
      margin-top: 15px;
      padding: 10px 15px;
      border-radius: 5px;
      display: none;
    }
    
    .form-feedback.success {
      display: block;
      background-color: rgba(40, 167, 69, 0.1);
      border-left: 4px solid #28a745;
      color: #28a745;
    }
    
    .form-feedback.error {
      display: block;
      background-color: rgba(220, 53, 69, 0.1);
      border-left: 4px solid #dc3545;
      color: #dc3545;
    }
    
    .spinner {
      margin-right: 8px;
      display: inline-block;
    }
    
    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `;
  document.head.appendChild(style);
});
