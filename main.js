// Dark Mode toggle function
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}

// Reset the form when the success message animation ends
document.querySelectorAll('.success-message').forEach(successMessage => {
  successMessage.addEventListener('animationend', function() {
    const form = successMessage.closest('form');
    form.reset();
  });
});

document.addEventListener('DOMContentLoaded', function () {
  // Predefined list of common email providers
  const providers = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com", "icloud.com"];
  
  // Define the regex pattern.
  const regexPattern = '^[a-z0-9._%+\\-]+@[a-z0-9.-]+\\.[a-z]{2,}$';
  const regex = new RegExp(regexPattern);
  
  // For each email input, use the existing suggestion container in the HTML.
  document.querySelectorAll('.email-input').forEach(input => {
    // Assume the suggestion container exists within the input's parent wrapper.
    const suggestionContainer = input.parentNode.querySelector('.email-suggestions-container');
    // Find the corresponding "Request Early Access" label in the form.
    const label = input.closest('form').querySelector('.btn-waitlist');
    
    // Input event: convert to lowercase, update custom validity, update suggestions, and toggle valid class.
    input.addEventListener('input', function() {
      // Convert the input value to lowercase.
      this.value = this.value.toLowerCase();
      
      // Check validity and update custom validity.
      if (regex.test(this.value < 12)) {
        this.setCustomValidity("Email must be at least 12 characters long");
        label.classList.add('valid');  // Add valid class when email is valid

        // Hide suggestion container if a valid email is detected.
        suggestionContainer.innerHTML = "";
        suggestionContainer.style.display = "none";
        return; // No need to show suggestions if the email is valid.
      } else {
        this.setCustomValidity("Please enter a valid email address (e.g., user@example.com)");
        label.classList.remove('valid'); // Remove valid class when email is invalid
      }
      
      // Domain suggestions logic (only for incomplete or invalid emails)
      if (this.value.includes('@')) {
        const parts = this.value.split('@');
        const domainPart = parts[1] || "";
        const filtered = providers.filter(provider => provider.startsWith(domainPart));
        
        if (filtered.length > 0 && domainPart.length > 0) {
          suggestionContainer.innerHTML = filtered
            .map(provider => `<div class="suggestion-item">${provider}</div>`)
            .join("");
          suggestionContainer.style.display = "block";
        } else {
          suggestionContainer.innerHTML = "";
          suggestionContainer.style.display = "none";
        }
      } else {
        suggestionContainer.innerHTML = "";
        suggestionContainer.style.display = "none";
      }
    });
    
    // Blur event: hide the suggestion dropdown after a short delay.
    input.addEventListener('blur', function() {
      setTimeout(() => {
        suggestionContainer.style.display = "none";
      }, 150);
    });
    
    // Click event on the suggestion container: allow user to pick a suggestion.
    suggestionContainer.addEventListener('click', function(e) {
      if (e.target && e.target.matches('.suggestion-item')) {
        const selectedDomain = e.target.textContent;
        const parts = input.value.split('@');
        input.value = parts[0] + "@" + selectedDomain;
        suggestionContainer.innerHTML = "";
        suggestionContainer.style.display = "none";
        // Return focus to the input so that Enter works.
        input.focus();
        // Trigger input event to update validation.
        input.dispatchEvent(new Event('input'));
      }
    });
  });
  
  // Prevent default form submission (covers Enter key) and process submission via our custom logic.
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent page refresh.
      processSubmission(form);
    });
  });
  
  // Helper function to process submission for a form.
  function processSubmission(form) {
    const emailInput = form.querySelector('.email-input');
    const successCheckbox = form.querySelector('input[type="checkbox"]');
    const label = form.querySelector('.btn-waitlist');
    
    // Force conversion to lowercase before validation.
    emailInput.value = emailInput.value.toLowerCase();
    
    // If the email does not match our regex, report validity.
    if (!regex.test(emailInput.value)) {
      emailInput.reportValidity();
      return false;
    }
    
    // Provide visual feedback by adding an 'active' class temporarily.
    label.classList.add('active');
    setTimeout(() => {
      label.classList.remove('active');
    }, 150);
    
    // Manually toggle the checkbox to trigger the success animation.
    successCheckbox.checked = true;
    return true;
  }
  
  // Attach a click listener to each "Request Early Access" label.
  document.querySelectorAll('.btn-waitlist').forEach(label => {
    label.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default behavior.
      const form = label.closest('form');
      processSubmission(form);
    });
  });
});
