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

  // Attach a click listener to each "Request Early Access" label.
  document.querySelectorAll('.btn-waitlist').forEach(label => {
    label.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default behavior

      const form = label.closest('form');
      const emailInput = form.querySelector('.email-input');
      const successCheckbox = form.querySelector('input[type="checkbox"]');
      
      // Force conversion to lowercase before validation.
      emailInput.value = emailInput.value.toLowerCase();

      // If the email does not match our regex, report validity.
      if (!regex.test(emailInput.value)) {
        emailInput.reportValidity();
        return;
      }
      
      // If valid, manually toggle the checkbox to trigger the success animation.
      successCheckbox.checked = true;
      label.style.cursor = 'pointer';
    });
  });
});
