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
 */
function setupEmailValidation() {
  const providers = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "icloud.com"];
  const regex = /^[a-z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  document.querySelectorAll('.email-input').forEach(input => {
    const suggestionContainer = input.parentNode.querySelector('.email-suggestions-container');
    const label = input.closest('form').querySelector('.btn-waitlist');
    let selectedIndex = -1;

    // Event delegation for keydown on suggestion items:
    suggestionContainer.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.target.classList.contains('suggestion-item')) {
        e.preventDefault();
        applySuggestion(input, suggestionContainer, e.target.textContent);
      }
    });

    input.addEventListener('input', function () {
      this.value = this.value.toLowerCase();
      selectedIndex = -1;
      if (regex.test(this.value)) {
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
        if (filtered.length > 0 && domainPart.length > 0) {
          // Each suggestion item is made focusable with tabindex="0"
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

    input.addEventListener('blur', function() {
      setTimeout(() => {
        // Only hide suggestions if focus is not inside the suggestion container
        if (!suggestionContainer.contains(document.activeElement)) {
          hideSuggestions(suggestionContainer);
        }
      }, 150);
    });

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
 * It performs a final validation of the email field and, if valid,
 * disables the submit button and sends the email to the API.
 *
 * @param {HTMLElement} form - The form element being submitted.
 * @returns {boolean} - Returns true if the submission proceeds, false otherwise.
 */
function processSubmission(form) {
  const emailInput = form.querySelector('.email-input');
  const submitButton = form.querySelector('.btn-waitlist');
  const regex = /^[a-z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  emailInput.value = emailInput.value.toLowerCase();

  if (!regex.test(emailInput.value)) {
    emailInput.setCustomValidity("Please enter a valid email address");
    emailInput.reportValidity();
    return false;
  }

  submitButton.textContent = "Sending...";
  submitButton.disabled = true;
  submitButton.classList.add("sending");

  submitEmail(emailInput.value, form, submitButton);
  return true;
}

/**
 * Submits the provided email to the API endpoint and updates the button UI based on the response.
 *
 * Workflow:
 * 1. Sends a POST request with the email in JSON format.
 * 2. If the response is successful (i.e., returns "Email sent successfully!"):
 *    - Waits 2 seconds to maintain the "Sending..." animation.
 *    - Updates the button text to "Thanks! You're on the list!", removes the "sending" class, and adds the "success" class.
 *    - Clears the email input field.
 *    - Disables the button to preserve the final success state indefinitely (allowing users to take a screenshot).
 * 3. If the response fails or a network error occurs:
 *    - Sets the button text to "Failed. Try again.", removes the "sending" class, and adds the "error" class.
 *    - After 3 seconds, resets the button text to "Request Early Access", removes the "error" class, and re-enables the button.
 *
 * @param {string} email - The email address to submit.
 * @param {HTMLElement} form - The form element containing the email input; used for clearing the field on success.
 * @param {HTMLElement} button - The submit button that triggers the request; its state is updated to reflect sending, success, or error.
 * @returns {Promise<void>} A promise that resolves when the submission workflow completes.
 */
async function submitEmail(email, form, button) {
  try {
    const response = await fetch('https://tmmsoftware-resend.vercel.app/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const result = await response.json();

    if (response.ok && result.message === "Email sent successfully!") {
      // Wait 2 seconds (keeping the "Sending..." animation)
      setTimeout(() => {
        // Transition to the success state.
        button.textContent = "Thanks!<br>You're on the list!";
        button.classList.remove("sending");
        button.classList.add("success");
        // Clear the email input.
        form.querySelector('.email-input').value = "";
        // Keep the button disabled so the final success state remains visible indefinitely.
        button.disabled = true;
      }, 2000);
    } else {
      // Handle error responses.
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
}
