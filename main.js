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
  // Attach a click listener to each "Request Early Access" label.
  document.querySelectorAll('.btn-waitlist').forEach(label => {
    label.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default label behavior
      
      const form = label.closest('form');
      const emailInput = form.querySelector('.email-input');
      const successCheckbox = form.querySelector('input[type="checkbox"]');
      
      // Our intended pattern as a string (make sure to escape backslashes)
      const regexPattern = '^[a-z0-9._%+\\-]+@[a-z0-9.-]+\\.[a-z]{2,}$';
      const regex = new RegExp(regexPattern);
      
      // Manually test the input value against the regex
      if (!regex.test(emailInput.value)) {
        // Set a custom validity message and trigger the error display
        emailInput.setCustomValidity("Please enter a valid email address (e.g., user@example.com)");
        emailInput.reportValidity();
        return;
      } else {
        // Clear any previous custom validity message
        emailInput.setCustomValidity("");
      }
      
      // Also check the browser's built-in validity (optional)
      if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
      } else {
        // If valid, manually toggle the checkbox to trigger success animation
        successCheckbox.checked = true;
      }
    });
  });
});
