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
  // Define the regex pattern.
  const regexPattern = '^[a-z0-9._%+\\-]+@[a-z0-9.-]+\\.[a-z]{2,}$';
  const regex = new RegExp(regexPattern);

  // For each email input, update custom validity on every keystroke.
  document.querySelectorAll('.email-input').forEach(input => {
    input.addEventListener('input', function() {
      // Convert input to lowercase in real-time.
      this.value = this.value.toLowerCase();
      
      if (regex.test(input.value)) {
        // Clear any custom validity if input is valid.
        input.setCustomValidity("");
      } else {
        // Set custom validity so that it shows an error message if checked.
        input.setCustomValidity("Please enter a valid email address (e.g., user@example.com)");
      }
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

    // If valid, add a temporary class to the label for visual feedback.
    label.classList.add('active');
    setTimeout(() => {
      label.classList.remove('active');
    }, 200);
    
    // If valid, then manually toggle the checkbox to trigger the success animation.
    successCheckbox.checked = true;
    return true;
  }

  // Prevent default submission for all forms and handle submission via Enter key.
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault(); // Prevent page refresh.
      processSubmission(form);
    });
  });

  // Attach a click listener to each "Request Early Access" label.
  document.querySelectorAll('.btn-waitlist').forEach(label => {
    label.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default label behavior
      
      const form = label.closest('form');
      processSubmission(form);
    });
  });
});

document.querySelectorAll('.email-input').forEach(input => {
  // Create the suggestion container
  let suggestionContainer = document.createElement('div');
  suggestionContainer.classList.add('email-suggestions-container');
  // Initially hide it
  suggestionContainer.style.display = 'none';
  // Insert it immediately after the input element
  input.parentNode.insertBefore(suggestionContainer, input.nextSibling);
});

