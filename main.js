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

// Hide suggestions (helper function)
function hideSuggestions(suggestionContainer) {
  suggestionContainer.innerHTML = "";
  suggestionContainer.style.display = "none";
}

// Setup email validation & suggestions
function setupEmailValidation() {
  const providers = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "icloud.com"];
  const regex = /^[a-z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  document.querySelectorAll('.email-input').forEach(input => {
    const suggestionContainer = input.parentNode.querySelector('.email-suggestions-container');
    const label = input.closest('form').querySelector('.btn-waitlist');
    let selectedIndex = -1;

    // Input event listener
    input.addEventListener('input', function () {
      this.value = this.value.toLowerCase();
      selectedIndex = -1;

      if (this.value.length >= 12 && regex.test(this.value)) {
        this.setCustomValidity("");
        label.classList.add('valid');
        hideSuggestions(suggestionContainer);
        return;
      }

      this.setCustomValidity("Please enter a valid email address");
      label.classList.remove('valid');

      if (this.value.includes('@')) {
        const domainPart = this.value.split('@')[1] || "";
        const filtered = providers.filter(provider => provider.startsWith(domainPart));

        filtered.length > 0 && domainPart.length > 0
          ? (suggestionContainer.innerHTML = filtered.map(p => `<div class="suggestion-item">${p}</div>`).join(""),
             suggestionContainer.style.display = "block")
          : hideSuggestions(suggestionContainer);
      } else {
        hideSuggestions(suggestionContainer);
      }
    });

    // Keyboard navigation
    input.addEventListener('keydown', function (e) {
      if (suggestionContainer.style.display !== 'block') return;
      const items = suggestionContainer.querySelectorAll('.suggestion-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = e.key === 'ArrowDown'
          ? (selectedIndex + 1) % items.length
          : (selectedIndex - 1 + items.length) % items.length;
        highlightSuggestion(items, selectedIndex);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        applySuggestion(input, suggestionContainer, items[selectedIndex].textContent);
      }
    });

    // Hide suggestions on blur
    input.addEventListener('blur', () => setTimeout(() => hideSuggestions(suggestionContainer), 150));

    // Click event for suggestions
    suggestionContainer.addEventListener('click', function (e) {
      if (e.target && e.target.matches('.suggestion-item')) {
        e.target.classList.add('highlight');
        setTimeout(() => {
          e.target.classList.remove('highlight');
          applySuggestion(input, suggestionContainer, e.target.textContent);
        }, 300);
      }
    });
  });
}

// Helper: Highlight selected suggestion
function highlightSuggestion(items, index) {
  items.forEach(item => item.classList.remove('highlight'));
  items[index].classList.add('highlight');
}

// Helper: Apply domain suggestion
function applySuggestion(input, container, domain) {
  input.value = input.value.split('@')[0] + "@" + domain;
  hideSuggestions(container);
  input.focus();
  input.dispatchEvent(new Event('input'));
}

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
  const submitButton = form.querySelector('.btn-waitlist'); // Fix: Correctly fetch the button

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
  submitEmail(emailInput.value, form, submitButton); // Fix: Correctly pass the button reference
  return true;
}

// Submit email to API
async function submitEmail(email, form, button) {
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

      // Reset button state
      button.textContent = "Request Early Access";
      button.disabled = false;

      // Display success message
      const successMessage = form.querySelector('.success-message');
      if (successMessage) {
        successMessage.textContent = "Thanks! You're on the list!";
        successMessage.style.color = "green";
        successMessage.style.display = "block";  // Ensure it's visible
      } else {
        console.warn("⚠️ Success message element not found.");
      }
    } else {
      console.error("❌ Error sending email:", result.error || "Unknown error");

      // Reset button state
      button.textContent = "Request Early Access";
      button.disabled = false;

      // Display failure message
      const failureMessage = form.querySelector('.success-message');
      if (failureMessage) {
        failureMessage.textContent = "Failed to send email. Try again.";
        failureMessage.style.color = "red";
        failureMessage.style.display = "block";  // Ensure it's visible
      }
    }
  } catch (error) {
    console.error('❌ Network or server error:', error);

    // Reset button state
    button.textContent = "Request Early Access";
    button.disabled = false;

    // Display error message
    const errorMessage = form.querySelector('.success-message');
    if (errorMessage) {
      errorMessage.textContent = "Failed to send email. Try again.";
      errorMessage.style.color = "red";
      errorMessage.style.display = "block";  // Ensure it's visible
    }
  }
}