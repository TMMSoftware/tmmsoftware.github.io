/**
 * Toggles dark mode for the webpage.
 * It toggles the "dark-mode" class on the body element and saves the current theme in localStorage.
 */
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

/**
 * Runs when the DOM is fully loaded.
 * - Applies the saved theme from localStorage.
 * - Sets up the dark mode switch behavior.
 * - Initializes email validation and form submission logic.
 */
document.addEventListener('DOMContentLoaded', function () {
  const modeSwitch = document.getElementById("mode-switch");
  const root = document.documentElement;
  if (modeSwitch) {
    modeSwitch.addEventListener("change", () => {
      if (modeSwitch.checked) {
        root.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }
    });
    const savedTheme = localStorage.getItem("theme") || "light";
    root.setAttribute("data-theme", savedTheme);
    modeSwitch.checked = savedTheme === "dark";
  }

  setupEmailValidation();
  setupFormSubmission();
});

/**
 * Clears and hides the suggestions container.
 *
 * @param {HTMLElement} suggestionContainer - The container element for email suggestions.
 */
function hideSuggestions(suggestionContainer) {
  suggestionContainer.innerHTML = "";
  suggestionContainer.style.display = "none";
}

/**
 * Sets up real-time email validation and suggestions.
 * Validates the email format as the user types and shows common provider suggestions based on input.
 * Also handles revealing the TOS checkbox only after the email is valid.
 */
function setupEmailValidation() {
  const providers = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "icloud.com"];
  // Basic email validation regex
  const regex = /^[a-z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  document.querySelectorAll('.email-input').forEach(input => {
    const suggestionContainer = input.parentNode.querySelector('.email-suggestions-container');
    const form = input.closest('form');
    const label = form.querySelector('.btn-waitlist');
    const tosSection = form.querySelector('.tos-section');
    const tosCheckbox = form.querySelector('.tos-checkbox');
    let selectedIndex = -1;

    // Helper to show/hide TOS section based on email validity
    function updateTOSVisibility() {
      if (regex.test(input.value)) {
        // Show TOS if email is valid
        if (tosSection) tosSection.style.display = 'block';
      } else {
        // Hide TOS if email is invalid
        if (tosSection) tosSection.style.display = 'none';
        if (tosCheckbox) tosCheckbox.checked = false;
      }
    }

    // Handle suggestion item keyboard events
    suggestionContainer.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.target.classList.contains('suggestion-item')) {
        e.preventDefault();
        applySuggestion(input, suggestionContainer, e.target.textContent);
      }
    });

    // On input, validate email, update TOS visibility, show suggestions, etc.
    input.addEventListener('input', function () {
      this.value = this.value.trim().toLowerCase();
      selectedIndex = -1;

      updateTOSVisibility();

      if (regex.test(this.value)) {
        this.setCustomValidity("");
        label.classList.add('valid');
        hideSuggestions(suggestionContainer);
        return;
      }
      this.setCustomValidity("Please enter a valid email address");
      label.classList.remove('valid');

      // Email suggestions logic
      if (this.value.includes('@')) {
        const domainPart = this.value.split('@')[1] || "";
        const filtered = providers.filter(provider => provider.startsWith(domainPart));
        if (filtered.length > 0 && domainPart.length > 0) {
          suggestionContainer.innerHTML = filtered
            .map(p => `<div class="suggestion-item" tabindex="0">${p}</div>`)
            .join("");
          suggestionContainer.style.display = "block";
        } else {
          hideSuggestions(suggestionContainer);
        }
      } else {
        hideSuggestions(suggestionContainer);
      }
    });

    // Handle arrow keys for navigating suggestion items
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

    // Hide suggestions on blur (with a short delay to allow click)
    input.addEventListener('blur', function() {
      setTimeout(() => {
        if (!suggestionContainer.contains(document.activeElement)) {
          hideSuggestions(suggestionContainer);
        }
      }, 150);
    });

    // Handle clicks on suggestion items
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

/**
 * Sets up the form submission logic.
 * It attaches event listeners for both form submission events and button clicks,
 * ensuring that the processSubmission function is called.
 */
function setupFormSubmission() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      processSubmission(form);
    });
  });

  document.querySelectorAll('.btn-waitlist').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      processSubmission(button.closest('form'));
    });
  });
}

/**
 * Handles the final form submission process.
 * 1) Validates the email.
 * 2) Ensures TOS is checked.
 * 3) Disables the button and sends the email to the API.
 *
 * @param {HTMLFormElement} form - The form element being submitted.
 * @returns {boolean} - Returns false if validation fails, otherwise true.
 */
function processSubmission(form) {
  const emailInput = form.querySelector('.email-input');
  const submitButton = form.querySelector('.btn-waitlist');
  const tosCheckbox = form.querySelector('.tos-checkbox');
  const regex = /^[a-z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  // Final email validation
  emailInput.value = emailInput.value.trim().toLowerCase();
  if (!regex.test(emailInput.value)) {
    emailInput.setCustomValidity("Please enter a valid email address");
    emailInput.reportValidity();
    return false;
  }

  // Check TOS acceptance
  if (tosCheckbox && !tosCheckbox.checked) {
    alert('Please accept the Terms of Service before continuing.');
    return false;
  }

  // UI feedback for "Sending..."
  submitButton.textContent = "Sending...";
  submitButton.disabled = true;
  submitButton.classList.add("sending");

  // Pass tosAccepted = true if checked
  const tosAccepted = tosCheckbox ? tosCheckbox.checked : false;
  submitEmail(emailInput.value, tosAccepted, form, submitButton);
  return true;
}

/**
 * Submits the provided email (and TOS acceptance) to the API endpoint
 * and updates the button UI based on the response.
 *
 * @param {string} email - The email address to submit.
 * @param {boolean} tosAccepted - Whether the user accepted the TOS.
 * @param {HTMLFormElement} form - The form element containing the email input; used for clearing the field on success.
 * @param {HTMLElement} button - The submit button that triggers the request; its state is updated to reflect sending, success, or error.
 * @returns {Promise<void>}
 */
async function submitEmail(email, tosAccepted, form, button) {
  try {
    const response = await fetch('https://tmmsoftware-resend.vercel.app/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, tosAccepted })
    });
    const result = await response.json();

    if (response.ok && result.message === "Email sent successfully!") {
      // Keep the "Sending..." animation for 2 seconds
      setTimeout(() => {
        // Transition to success
        button.innerHTML = `
          <span style="display:block;">Thanks!</span>
          <span style="display:block;">You're on the list</span>
        `;
        button.classList.remove("sending");
        button.classList.add("success");

        // Clear input + uncheck TOS
        form.querySelector('.email-input').value = "";
        const tosBox = form.querySelector('.tos-checkbox');
        if (tosBox) tosBox.checked = false;

        // Keep button disabled so final success state remains
        button.disabled = true;
      }, 2000);
    } else {
      // Error from server
      button.textContent = "Failed. Try again.";
      button.classList.remove("sending");
      button.classList.add("error");

      setTimeout(() => {
        button.textContent = "Request Early Access";
        button.classList.remove("error");
        button.disabled = false;
      }, 3000);
    }
  } catch (error) {
    console.error('Error:', error);
    button.textContent = "Failed. Try again.";
    button.classList.remove("sending");
    button.classList.add("error");

    setTimeout(() => {
      button.textContent = "Request Early Access";
      button.classList.remove("error");
      button.disabled = false;
    }, 3000);
  }
}

/**
 * Highlights one suggestion from a list by removing previous highlights.
 *
 * @param {NodeList} items - The list of suggestion elements.
 * @param {number} index - The index of the suggestion to highlight.
 */
function highlightSuggestion(items, index) {
  items.forEach(item => item.classList.remove('highlight'));
  items[index].classList.add('highlight');
}

/**
 * Applies the selected suggestion to the email input.
 * It replaces the domain part of the current email with the selected suggestion,
 * clears any custom validation error, and marks the input as valid.
 *
 * @param {HTMLElement} input - The email input field.
 * @param {HTMLElement} suggestionContainer - The container for suggestions to hide after applying.
 * @param {string} suggestionText - The suggested domain text to apply.
 */
function applySuggestion(input, suggestionContainer, suggestionText) {
  const [localPart] = input.value.split('@');
  input.value = `${localPart}@${suggestionText}`;
  input.setCustomValidity("");
  input.closest('form').querySelector('.btn-waitlist').classList.add('valid');
  hideSuggestions(suggestionContainer);

  // IMPORTANT: Fire an 'input' event so your TOS logic sees the new value
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

// =========================
// Modal Logic for TOS/Privacy
// =========================
const modal = document.getElementById('policyModal');
const modalContent = document.getElementById('modalContent');
const privacyLink = document.getElementById('openPrivacyPolicy');
const termsLink = document.getElementById('openTermsOfService');
const closeBtn = document.querySelector('.modal .close');

/**
 * Loads content from a file (privacy.html or terms.html) into the modal.
 * @param {string} file - The path to the file to load ('privacy.html').
 */
function loadPolicy(file) {
  fetch(file)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(html => {
      modalContent.innerHTML = html;
      modal.style.display = 'flex';
    })
    .catch(error => {
      modalContent.innerHTML = '<p>Error loading content.</p>';
      modal.style.display = 'flex';
      console.error('Error:', error);
    });
}

// If these links exist, hook them up to open the modal
if (privacyLink) {
  privacyLink.addEventListener('click', function(e) {
    e.preventDefault();
    loadPolicy('privacy.html');
  });
}
if (termsLink) {
  termsLink.addEventListener('click', function(e) {
    e.preventDefault();
    loadPolicy('terms.html');
  });
}

// Close the modal when the close button is clicked
if (closeBtn) {
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
  });
}

// Close the modal when clicking outside of the modal content
window.addEventListener('click', function(e) {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Close the modal by pressing the Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    modal.style.display = 'none';
  }
});
