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

// Run when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Attach a click listener to each "Request Early Access" label.
  document.querySelectorAll('.btn-waitlist').forEach(label => {
    label.addEventListener('click', function(e) {
      // Prevent the default label action (which toggles the checkbox)
      e.preventDefault();
      
      const form = label.closest('form');
      const emailInput = form.querySelector('.email-input');
      const successCheckbox = form.querySelector('input[type="checkbox"]');
      
      // Check if the email is valid
      if (!emailInput.checkValidity()) {
        // Show the built-in browser validation error
        emailInput.reportValidity();
      } else {
        // Valid: manually check the checkbox to trigger the success animation
        successCheckbox.checked = true;
      }
    });
  });
});
