// Dark Mode toggle function
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

// Load theme from localStorage
document.addEventListener('DOMContentLoaded', function () {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark") document.body.classList.add("dark-mode");

  setupEmailValidation();
  setupFormSubmission();
});

// Reset the form when the success message animation ends
document.querySelectorAll('.success-message').forEach(successMessage => {
  successMessage.addEventListener('animationend', function () {
    const form = successMessage.closest('form');
    if (form) form.reset();
  });
});

// Setup form submission logic
function setupFormSubmission() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      processSubmission(form);
    });
  });

  // Make labels clickable
  document.querySelectorAll('.btn-waitlist').forEach(label => {
    label.addEventListener('click', function (e) {
      e.preventDefault();
      processSubmission(label.closest('form'));
    });
  });
}

// Form submission logic
function processSubmission(form) {
  const emailInput = form.querySelector('.email-input');
  const successMessage = form.querySelector('.success-message');
  const errorMessage = form.querySelector('.error-message');
  const submitButton = form.querySelector('.btn-waitlist');

  const regex = /^[a-z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  emailInput.value = emailInput.value.toLowerCase();

  if (!regex.test(emailInput.value)) {
    emailInput.setCustomValidity("Enter a valid email (min 12 chars)");
    emailInput.reportValidity();
    return false;
  }

  // Disable button & show loading state
  submitButton.textContent = "Sending...";
  submitButton.disabled = true;

  // Call function to send email
  submitEmail(emailInput.value, form, submitButton, successMessage);
  return true;
}

// Submit email to API
async function submitEmail(email, form, button, successMessage) {
  try {
    if (!button) {
      console.error("❌ Button element not found!");
      return;
    }

    // Set button to loading state
    button.textContent = "Sending...";
    button.disabled = true;

    const response = await fetch('https://tmmsoftware-resend.vercel.app/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    const result = await response.json();

    if (response.ok && result.message === "Email sent successfully!") {
      console.log("✅ Email sent successfully!");

      // Show success message
      if (successMessage) {
        successMessage.textContent = "You're on the list!";
        successMessage.style.color = "#27ae60";
        successMessage.style.display = "block";
      }

      // Reset button state after a delay
      setTimeout(() => {
        button.textContent = "Request Early Access";
        button.disabled = false;

        // Hide success message after animation ends
        successMessage.style.opacity = "1";
        setTimeout(() => {
          successMessage.style.opacity = "0";
          successMessage.style.display = "none";
          form.reset(); // Reset form here
        }, 3000);
      }, 1500);
    } else {
      console.error("❌ Error sending email:", result.error || "Unknown error");

      // Reset button state
      button.textContent = "Request Early Access";
      button.disabled = false;

      // Display failure message
      const failureMessage = form.querySelector('.error-message');
      if (failureMessage) {
        failureMessage.textContent = "Failed to send email. Try again.";
        failureMessage.style.color = "red";
        failureMessage.style.display = "block";
      }
    }
  } catch (error) {
    console.error('❌ Network or server error:', error);

    // Reset button state
    button.textContent = "Request Early Access";
    button.disabled = false;

    // Display error message
    const errorMessage = form.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.textContent = "Failed to send email. Try again.";
      errorMessage.style.color = "red";
      errorMessage.style.display = "block";
    }
  }
}
