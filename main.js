/**
 * Toggles dark mode for the webpage.
 * It toggles the "dark-mode" class on the body element and saves the current theme in localStorage.
 */
function toggleTheme() {
  // Toggle the "dark-mode" class on the body element.
  document.body.classList.toggle("dark-mode");
  // Save the theme ("dark" if dark-mode class is present, otherwise "light") in localStorage.
  localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
}

/**
 * Runs when the DOM is fully loaded.
 * - Applies the saved theme from localStorage.
 * - Sets up the dark mode switch behavior.
 * - Initializes email validation and form submission logic.
 */
document.addEventListener('DOMContentLoaded', function () {
  // Dark mode switch setup using the checkbox with id "mode-switch"
  const modeSwitch = document.getElementById("mode-switch");
  const root = document.documentElement; // Use the root element for theme changes

  if (modeSwitch) {
    // When the switch is toggled, update the data-theme attribute and save preference.
    modeSwitch.addEventListener("change", () => {
      if (modeSwitch.checked) {
        root.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }
    });

    // On page load, check for a saved theme (default to light)
    const savedTheme = localStorage.getItem("theme") || "light";
    root.setAttribute("data-theme", savedTheme);
    modeSwitch.checked = savedTheme === "dark";
  }
  // Initialize email validation (includes real-time checks and suggestions).
  setupEmailValidation();
  // Set up form submission event listeners.
  setupFormSubmission();
});

/**
 * Clears and hides the suggestions container.
 *
 * @param {HTMLElement} suggestionContainer - The container element for email suggestions.
 */
function hideSuggestions(suggestionContainer) {
  // Clear all content inside the suggestion container.
  suggestionContainer.innerHTML = "";
  // Hide the suggestion container by setting its display to "none".
  suggestionContainer.style.display = "none";
}

/**
 * Sets up real-time email validation and suggestions.
 * Validates the email format as the user types and shows common provider suggestions based on input.
 */
function setupEmailValidation() {
  // List of common email providers used for suggestions.
  const providers = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "icloud.com"];
  // Regular expression for standard email validation.
  const regex = /^[a-z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  // For each email input field found on the page:
  document.querySelectorAll('.email-input').forEach(input => {
    // Get the suggestion container that is a sibling of the input.
    const suggestionContainer = input.parentNode.querySelector('.email-suggestions-container');
    // Get the submission button in the closest form (to update its visual state based on validation).
    const label = input.closest('form').querySelector('.btn-waitlist');
    // This will track which suggestion is currently highlighted for keyboard navigation.
    let selectedIndex = -1;

    // Listen for input events to validate email in real time.
    input.addEventListener('input', function () {
      // Convert the input value to lowercase for uniformity.
      this.value = this.value.toLowerCase();
      // Reset the suggestion selection index on every input.
      selectedIndex = -1;

      // Check if the email format is valid using the regex.
      if (regex.test(this.value)) {
        // If valid, clear any custom error messages.
        this.setCustomValidity("");
        // Visually mark the input as valid (by adding a class to the button).
        label.classList.add('valid');
        // Hide any provider suggestions.
        hideSuggestions(suggestionContainer);
        return;
      }

      // If not valid, set a custom validity message.
      this.setCustomValidity("Please enter a valid email address");
      // Remove the valid visual indicator from the submit button.
      label.classList.remove('valid');

      // If the input contains '@', try to display provider suggestions.
      if (this.value.includes('@')) {
        // Split the email and extract the domain part (after the '@').
        const domainPart = this.value.split('@')[1] || "";
        // Filter providers to those that start with the current domain input.
        const filtered = providers.filter(provider => provider.startsWith(domainPart));

        // If matching suggestions are found and the domain part is not empty:
        if (filtered.length > 0 && domainPart.length > 0) {
          // Display suggestions by mapping each provider into a suggestion item.
          suggestionContainer.innerHTML = filtered.map(p => `<div class="suggestion-item">${p}</div>`).join("");
          // Make the suggestion container visible.
          suggestionContainer.style.display = "block";
        } else {
          // Otherwise, hide suggestions.
          hideSuggestions(suggestionContainer);
        }
      } else {
        // If '@' is not present, hide suggestions.
        hideSuggestions(suggestionContainer);
      }
    });

    /**
     * Handles keyboard navigation within the suggestion list.
     * Supports ArrowUp/ArrowDown for navigation and Enter to select a suggestion.
     */
    input.addEventListener('keydown', function (e) {
      // Only proceed if suggestions are visible.
      if (suggestionContainer.style.display !== 'block') return;
      // Get all suggestion items.
      const items = suggestionContainer.querySelectorAll('.suggestion-item');
      if (!items.length) return;

      // Navigate suggestions using Arrow keys.
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        // Update the selected index based on the arrow key pressed.
        selectedIndex = e.key === 'ArrowDown'
          ? (selectedIndex + 1) % items.length
          : (selectedIndex - 1 + items.length) % items.length;
        // Highlight the currently selected suggestion.
        highlightSuggestion(items, selectedIndex);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        // If Enter is pressed and a suggestion is selected, apply it.
        e.preventDefault();
        applySuggestion(input, suggestionContainer, items[selectedIndex].textContent);
      }
    });

    // When the input loses focus, hide suggestions after a short delay (to allow clicks on suggestions).
    input.addEventListener('blur', () => setTimeout(() => hideSuggestions(suggestionContainer), 150));

    /**
     * Allow clicking on a suggestion to apply it.
     * Temporarily highlights the clicked suggestion before applying.
     */
    suggestionContainer.addEventListener('click', function (e) {
      if (e.target && e.target.matches('.suggestion-item')) {
        // Add a temporary highlight for visual feedback.
        e.target.classList.add('highlight');
        // After a short delay, remove highlight and apply the suggestion.
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
  // Attach a submit event listener to all forms.
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      processSubmission(form);
    });
  });

  // Attach a click event listener to all buttons with the class 'btn-waitlist'.
  document.querySelectorAll('.btn-waitlist').forEach(button => {
    button.addEventListener('click', function (e) {
      e.preventDefault();
      // Process the submission for the form that contains the clicked button.
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
  // Get the email input field and the submit button from the form.
  const emailInput = form.querySelector('.email-input');
  const submitButton = form.querySelector('.btn-waitlist');
  // Regular expression for standard email validation.
  const regex = /^[a-z0-9._%+\-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  // Ensure the email is in lowercase.
  emailInput.value = emailInput.value.toLowerCase();

  // Final check: if the email doesn't match the regex, display an error.
  if (!regex.test(emailInput.value)) {
    emailInput.setCustomValidity("Please enter a valid email address");
    emailInput.reportValidity();
    return false;
  }

  // Update the button to show that the email is being sent.
  submitButton.textContent = "Sending...";
  submitButton.disabled = true;
  submitButton.classList.add("sending");

  // Call the async function to send the email to the API.
  submitEmail(emailInput.value, form, submitButton);
  return true;
}

/**
 * Submits the email address to the API endpoint.
 * Based on the response, it updates the submit button to reflect success or failure.
 *
 * @param {string} email - The email address to be submitted.
 * @param {HTMLElement} form - The form element containing the email input.
 * @param {HTMLElement} button - The submit button to update with feedback.
 */
async function submitEmail(email, form, button) {
  try {
    // Send a POST request to the API with the email address in JSON format.
    const response = await fetch('https://tmmsoftware-resend.vercel.app/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });

    // Parse the JSON response from the API.
    const result = await response.json();

    // Check if the response was successful and the API confirmed the email was sent.
    if (response.ok && result.message === "Email sent successfully!") {
      // Show a success message on the button after a short delay.
      setTimeout(() => {
        button.textContent = "Thanks! You're on the list!";
        button.classList.remove("sending");
        button.classList.add("success");
      }, 5000);

      // Reset the button text and state after a few seconds.
      setTimeout(() => {
        button.textContent = "Request Early Access";
        button.classList.remove("success");
        button.disabled = false;
      }, 4000);
    } else {
      // If the response indicates failure, update the button to show an error.
      button.textContent = "Failed. Try again.";
      button.classList.remove("sending");
      button.classList.add("error");

      // Reset the button after a short delay.
      setTimeout(() => {
        button.textContent = "Request Early Access";
        button.classList.remove("error");
        button.disabled = false;
      }, 4000);
    }
  } catch (error) {
    // In case of network or other errors, notify the user and reset the button.
    button.textContent = "Failed. Try again.";
    button.classList.remove("sending");
    button.classList.add("error");

    setTimeout(() => {
      button.textContent = "Request Early Access";
      button.classList.remove("error");
      button.disabled = false;
    }, 4000);
  }
}

/**
 * Highlights one suggestion from a list by removing previous highlights.
 *
 * @param {NodeList} items - The list of suggestion elements.
 * @param {number} index - The index of the suggestion to highlight.
 */
function highlightSuggestion(items, index) {
  // Remove the highlight class from all suggestion items.
  items.forEach(item => item.classList.remove('highlight'));
  // Add the highlight class to the item at the given index.
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
  // Extract the local part (before the '@') from the current input.
  const [localPart] = input.value.split('@');
  // Update the email input with the chosen suggestion.
  input.value = `${localPart}@${suggestionText}`;
  // Clear any custom validity error message.
  input.setCustomValidity("");
  // Mark the associated submit button as valid by adding the 'valid' class.
  input.closest('form').querySelector('.btn-waitlist').classList.add('valid');
  // Hide the suggestions now that a suggestion has been applied.
  hideSuggestions(suggestionContainer);
}
